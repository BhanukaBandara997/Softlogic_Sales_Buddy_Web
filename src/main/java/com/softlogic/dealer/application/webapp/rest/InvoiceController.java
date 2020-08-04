package com.softlogic.dealer.application.webapp.rest;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.softlogic.dealer.application.webapp.entity.*;
import com.softlogic.dealer.application.webapp.service.*;
import com.softlogic.dealer.application.webapp.utils.AppConstants;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/rest")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    FileStorageService fileStorageService;


    @RequestMapping(value = "/createInvoice", method = RequestMethod.POST)
    public ResponseEntity<String> createInvoice(@RequestBody Map<String, Object> request) {
        JSONObject returnObj = new JSONObject();
        String userEmail = request.get("userEmail").toString();
        String invoiceId = request.get("invoiceId").toString();
        int totalProductQty = Integer.parseInt(request.get("totalProductQty").toString());
        String invoiceThumbnail = request.get("invoiceImagePath").toString();
        List<String> invoiceProductList = (List<String>) request.get("invoiceProductList");

        Set<Product> addedProductList = new HashSet<>();
        for (String productSerialNo : invoiceProductList) {
            Product productObj = productService.findByProductSerialNo(productSerialNo);
            addedProductList.add(productObj);
        }

        User user = userService.findByEmail(userEmail);
        Invoice invoice = new Invoice();
        invoice.setInvoiceId(invoiceId);
        invoice.setUser(user);
        invoice.setInvoiceImagePath(invoiceThumbnail);
        invoice.setProducts(addedProductList);
        invoice.setTotalProductsQty(totalProductQty);
        invoiceService.save(invoice);
        returnObj.put("msg", "Invoice Saved");
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }

    @RequestMapping(value = "/createInvoice", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createInvoice(@RequestBody Map<String, Object> request,
                                                @RequestParam(value = AppConstants.PRODUCT_FILE_PARAM, required = true) MultipartFile file)
            throws JsonParseException, JsonMappingException, IOException {
        String statusInvoice = null;
        JSONObject returnObj = new JSONObject();
        String userEmail = request.get("userEmail").toString();
        String invoiceId = request.get("invoiceId").toString();
        int totalProductQty = Integer.parseInt(request.get("totalProductQty").toString());
        String invoiceThumbnail = request.get("invoiceImagePath").toString();
        List<String> invoiceProductList = (List<String>) request.get("invoiceProductList");

        Set<Product> addedProductList = new HashSet<>();
        for (String productSerialNo : invoiceProductList) {
            Product productObj = productService.findByProductSerialNo(productSerialNo);
            addedProductList.add(productObj);
        }

        User user = userService.findByEmail(userEmail);
        Invoice invoice = new Invoice();
        invoice.setInvoiceId(invoiceId);
        invoice.setUser(user);
        invoice.setInvoiceImagePath(invoiceThumbnail);
        invoice.setProducts(addedProductList);
        invoice.setTotalProductsQty(totalProductQty);
        invoiceService.save(invoice);
        returnObj.put("msg", "Invoice Saved");
        String fileName = fileStorageService.storeFile(file);
        String fileDownloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path(AppConstants.DOWNLOAD_PRODUCT_PATH).path(fileName).toUriString();
//      product.setProductImagePath(fileDownloadUrl.split("downloadProductFile")[0]+"rest/downloadProductFile" +fileDownloadUrl.split("downloadProductFile")[1]);
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }


    @RequestMapping(value = "/getInvoiceByUserId", method = RequestMethod.POST)
    public ResponseEntity<String> getInvoiceByUserId(@RequestParam Integer userId) {
        List<Invoice> invoiceList = invoiceService.findByUserId(userId);
        List<JSONObject> returnObj = new ArrayList<>();
        for (Invoice invoice : invoiceList) {
            JSONObject invoiceObj = new JSONObject();
            invoiceObj.put("invoiceUserId", invoice.getUser().getId());
            invoiceObj.put("invoiceId", invoice.getInvoiceId());
            Set<Product> products = invoice.getProducts();
            int soldProductsCount = 0;
            for (Product product : products) {
                JSONObject invoiceProduct = new JSONObject();
                invoiceProduct.put("productId", product.getProductId());
                invoiceProduct.put("productQuantity", product.getProductQuantity());
                soldProductsCount += product.getProductQuantity();
            }
            invoiceObj.put("productsSold", soldProductsCount);
            returnObj.add(invoiceObj);
        }
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }

    @RequestMapping(value = "/getAllInvoices", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAll() {
        List<Invoice> invoiceList = invoiceService.getAllInvoices();
        List<JSONObject> entities = new ArrayList<>();
        for (Invoice invoice : invoiceList) {
            JSONObject entity = new JSONObject();
            entity.put("invoiceId", invoice.getInvoiceId());
            entity.put("invoiceImagePath", invoice.getInvoiceImagePath());
            entity.put("invoiceUser", invoice.getUser());
            entity.put("invoiceProducts", invoice.getProducts());
            entities.add(entity);
        }
        return ResponseEntity.status(HttpStatus.OK).body(entities.toString());
    }

    @RequestMapping(value = "/getCategorySales", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getCategorySales(@RequestParam Integer userId) {
        List<Invoice> invoiceList = invoiceService.findByUserIdOrderByProducts_Category_CategoryName(userId);
        List<JSONObject> entities = new ArrayList<>();
        Map<String, List<Product>> categoryProductList = new HashMap<>();
        List<Product> list;
        for (Invoice invoice : invoiceList) {
            Set<Product> productsList = invoice.getProducts();
            for (Product product : productsList) {
                categoryProductList.put(product.getCategory().getCategoryName(), null);
                if (categoryProductList.containsKey(product.getCategory().getCategoryName())) {
                    // if the key has already been used,
                    // we'll just grab the array list and add the value to it
                    list = categoryProductList.get(product.getCategory().getCategoryName());
                    list.add(product);
                } else {
                    // if the key hasn't been used yet,
                    // we'll create a new ArrayList<String> object, add the value
                    // and put it in the array list with the new key
                    list = new ArrayList<>();
                    list.add(product);
                    categoryProductList.put(product.getCategory().getCategoryName(), list);
                }
            }
        }

        JSONArray returnObj = new JSONArray();
        for (Map.Entry<String, List<Product>> entry : categoryProductList.entrySet()) {
            JSONObject categoryObj = new JSONObject();
            categoryObj.put("categoryName", entry.getKey());
            List<Product> productList = entry.getValue();
            int categorySalesAmount = 0;
            for (Product product : productList) {
                categorySalesAmount += product.getProductQuantity();

            }
            categoryObj.put("categorySalesAmount", categorySalesAmount);
            returnObj.put(categoryObj);
        }
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }
}
