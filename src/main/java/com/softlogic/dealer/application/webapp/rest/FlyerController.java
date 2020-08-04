package com.softlogic.dealer.application.webapp.rest;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.softlogic.dealer.application.webapp.entity.Flyer;
import com.softlogic.dealer.application.webapp.entity.Product;
import com.softlogic.dealer.application.webapp.service.FileStorageService;
import com.softlogic.dealer.application.webapp.service.FlyerService;
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
public class FlyerController {

    @Autowired
    private FlyerService flyerService;

    @Autowired
    ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    FileStorageService fileStorageService;

    @RequestMapping(value = "/addPromotion", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addPromotion(@RequestParam(value = AppConstants.PROMOTION_JSON_PARAM, required = true) String promotionJson,
                                             @RequestParam(value = AppConstants.PRODUCT_FILE_PARAM, required = true) MultipartFile file)
            throws JsonParseException, JsonMappingException, IOException {
        String status;
        Flyer flyer = objectMapper.readValue(promotionJson, Flyer.class);
        Flyer flyerObj = flyerService.findByFlyerName(flyer.getFlyerName());
        if (flyerObj == null) {
            String fileName = fileStorageService.storeFile(file);
            String fileDownloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path(AppConstants.DOWNLOAD_PROMOTION_PATH).path(fileName).toUriString();
            flyer.setFlyerImagePath(fileDownloadUrl.split("downloadPromotionFile")[0]+"rest/downloadPromotionFile" +fileDownloadUrl.split("downloadPromotionFile")[1]);
            flyerService.save(flyer);
            status = "Flyer creation success";
        } else {
            status = "Flyer already exists";
        }
        JSONObject returnObj = new JSONObject();
        returnObj.put("msg", status);
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }

    @RequestMapping(value = "/addPromotionImage", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addPromotionImage(@RequestParam(value = AppConstants.PRODUCT_FILE_PARAM, required = true) MultipartFile file)
            throws JsonParseException, JsonMappingException, IOException {
        String fileName = fileStorageService.storeFile(file);
        String fileDownloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path(AppConstants.DOWNLOAD_PROMOTION_PATH).path(fileName).toUriString();
        JSONObject returnObj = new JSONObject();
        if (fileDownloadUrl != null && !fileDownloadUrl.equals("")){
            Flyer flyer = new Flyer();
            flyer.setFlyerImagePath(fileDownloadUrl.split("downloadPromotionFile")[0]+"rest/downloadPromotionFile" +fileDownloadUrl.split("downloadPromotionFile")[1]);
            String promotionImagePath = flyer.getFlyerImagePath();
            returnObj.put("msg", "Image Uploaded");
            returnObj.put("fileName", fileName);
            returnObj.put("promotionImagePath", promotionImagePath);
        }else {
            returnObj.put("msg", "Image Not Uploaded");
        }
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }

    @RequestMapping(value = AppConstants.DOWNLOAD_PROMOTION_URI, method = RequestMethod.GET)
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

    @RequestMapping(value = "/deleteFlyerById", method = RequestMethod.POST)
    public ResponseEntity<String> deleteFlyerById(@RequestParam String flyerId) {
        Optional<Flyer> flyerOptObj = flyerService.findById(Integer.valueOf(flyerId));
        JSONObject flyerResponseObj = new JSONObject();
        Flyer flyerObj = flyerOptObj.get();
        flyerService.delete(flyerObj);
        flyerResponseObj.put("msg", "Flyer Deleted Success");
        return ResponseEntity.status(HttpStatus.OK).body(flyerResponseObj.toString());
    }

    @RequestMapping(value = "/getAllFlyers", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getAllFlyers() {
        List<Flyer> flyerList = flyerService.getAllFlyers();
        List<JSONObject> entities = new ArrayList<>();
        for (Flyer flyer : flyerList) {
            JSONObject entity = new JSONObject();
            entity.put("flyerId", flyer.getFlyerId());
            entity.put("flyerName", flyer.getFlyerName());
            entity.put("flyerLink", flyer.getFlyerLink());
            entity.put("flyerImagePath", flyer.getFlyerImagePath());
            entities.add(entity);
        }
        return ResponseEntity.status(HttpStatus.OK).body(entities.toString());
    }
}
