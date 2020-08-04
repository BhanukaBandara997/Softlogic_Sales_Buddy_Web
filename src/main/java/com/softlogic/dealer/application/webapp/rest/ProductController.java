package com.softlogic.dealer.application.webapp.rest;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.softlogic.dealer.application.webapp.entity.Category;
import com.softlogic.dealer.application.webapp.entity.Product;
import com.softlogic.dealer.application.webapp.repository.ProductRepository;
import com.softlogic.dealer.application.webapp.service.CategoryService;
import com.softlogic.dealer.application.webapp.service.FileStorageService;
import com.softlogic.dealer.application.webapp.service.ProductService;
import com.softlogic.dealer.application.webapp.utils.AppConstants;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rest")
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductService productService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    FileStorageService fileStorageService;

    @RequestMapping(value = "/addProduct", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addProduct(@RequestParam(value = AppConstants.PRODUCT_JSON_PARAM, required = true) String productJson,
                                             @RequestParam(value = AppConstants.PRODUCT_FILE_PARAM, required = true) MultipartFile file)
            throws JsonParseException, JsonMappingException, IOException {
        Product product = objectMapper.readValue(productJson, Product.class);
        String statusProduct, statusCategory = null;
        Product productObj = productService.findByProductName(product.getProductName());
        if (productObj == null) {
            String fileName = fileStorageService.storeFile(file);
            String fileDownloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path(AppConstants.DOWNLOAD_PRODUCT_PATH).path(fileName).toUriString();
            Category categoryObj = categoryService.findByCategoryNameIgnoreCase(product.getCategory().getCategoryName());
            if (categoryObj == null) {
                product.setProductImagePath(fileDownloadUrl.split("downloadProductFile")[0]+"rest/downloadProductFile" +fileDownloadUrl.split("downloadProductFile")[1]);
                product.getCategory().setCategoryImagePath(fileDownloadUrl);
                productService.saveCategory(product);
                statusCategory = "Category creation success";
            } else {
                product.setProductImagePath(fileDownloadUrl.split("downloadProductFile")[0]+"rest/downloadProductFile" +fileDownloadUrl.split("downloadProductFile")[1]);
                product.setCategory(categoryObj);
                productService.save(product);
                statusCategory = "Category already exists";
            }
            statusProduct = "Product creation success";
        } else {
            statusProduct = "Product already exists";
        }
        JSONObject returnObj = new JSONObject();
        returnObj.put("msg", statusProduct + "-" + statusCategory);
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }

    @RequestMapping(value = "/addProductImage", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addProductImage(@RequestParam(value = AppConstants.PRODUCT_FILE_PARAM, required = true) MultipartFile file)
            throws JsonParseException, JsonMappingException, IOException {
        String fileName = fileStorageService.storeFile(file);
        String fileDownloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path(AppConstants.DOWNLOAD_PRODUCT_PATH).path(fileName).toUriString();
        JSONObject returnObj = new JSONObject();
        if (fileDownloadUrl != null && !fileDownloadUrl.equals("")) {
            Product product = new Product();
            product.setProductImagePath(fileDownloadUrl.split("downloadProductFile")[0]+"rest/downloadProductFile" +fileDownloadUrl.split("downloadProductFile")[1]);
            String productImagePath = product.getProductImagePath();
            returnObj.put("msg", "Image Uploaded");
            returnObj.put("fileName", fileName);
            returnObj.put("productImagePath", productImagePath);
        } else {
            returnObj.put("msg", "Image Not Uploaded");
        }
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }

    @RequestMapping(value = "/downloadProductFile/{fileName:.+}", method = RequestMethod.GET)
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        if (contentType == null) {
            contentType = AppConstants.DEFAULT_CONTENT_TYPE;
        }
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).header(HttpHeaders.CONTENT_DISPOSITION, String.format(AppConstants.FILE_DOWNLOAD_HTTP_HEADER, resource.getFilename())).body(resource);
    }


    @RequestMapping(value = "/deleteProductById", method = RequestMethod.POST)
    public ResponseEntity<String> deleteProductById(@RequestParam Integer productId) {
        Optional<Product> productOptObj = productService.findById(productId);
        Product productObj = productOptObj.get();
        productService.delete(productObj);
        JSONObject userDeletedObj = new JSONObject();
        userDeletedObj.put("msg", "Product Delete Success");
        return ResponseEntity.status(HttpStatus.OK).body(userDeletedObj.toString());
    }

    @RequestMapping(value = "/getAllProducts", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAllProducts() {
        List<Product> productList = productService.getAllProducts();
        List<JSONObject> entities = new ArrayList<>();
        for (Product product : productList) {
            JSONObject entity = new JSONObject();
            entity.put("productId", product.getProductId());
            entity.put("category", product.getCategory().getCategoryName());
            entity.put("categoryId", product.getCategory().getCategoryId());
            entity.put("productName", product.getProductName());
            entity.put("productSerialNo", product.getProductSerialNo());
            entity.put("productDescription", product.getProductDescription());
            entity.put("productSummaryDetails", product.getProductDescription().split("-")[0]);
            entity.put("productLink", product.getProductLink());
            entity.put("productImagePath", product.getProductImagePath());
            entities.add(entity);
        }
        return ResponseEntity.status(HttpStatus.OK).body(entities.toString());
    }

    @RequestMapping(value = "/getAllProductsByCategoryName", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAllProductsByCategoryName(@RequestParam String categoryName) {
        List<Product> productList = productService.findByCategory_CategoryName(categoryName);
        List<JSONObject> entities = new ArrayList<>();
        for (Product product : productList) {
            JSONObject entity = new JSONObject();
            entity.put("productId", product.getProductId());
            entity.put("category", product.getCategory().getCategoryName());
            entity.put("categoryId", product.getCategory().getCategoryId());
            entity.put("productName", product.getProductName());
            entity.put("productSerialNo", product.getProductSerialNo());
            entity.put("productDescription", product.getProductDescription());
            entity.put("productSummaryDetails", product.getProductDescription().split("-")[0]);
            entity.put("productLink", product.getProductLink());
            entity.put("productImagePath", product.getProductImagePath());
            entities.add(entity);
        }
        return ResponseEntity.status(HttpStatus.OK).body(entities.toString());
    }
}
