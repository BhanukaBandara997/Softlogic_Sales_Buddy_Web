package com.softlogic.dealer.application.webapp.utils;

public class AppConstants {

    public static final String PRODUCT_JSON_PARAM = "productJson";
    public static final String PROMOTION_JSON_PARAM = "promotionJson";
    public static final String PRODUCT_FILE_PARAM = "file";
    public static final String FILE_SEPERATOR = "_";
    public static final String DOWNLOAD_PRODUCT_PATH = "downloadProductFile/";
    public static final String DOWNLOAD_PROMOTION_PATH = "downloadPromotionFile/";
    public static final String DOWNLOAD_PRODUCT_URI = "downloadProductFile/{fileName:.+}";
    public static final String DOWNLOAD_PROMOTION_URI = "downloadPromotionFile/{fileName:.+}";
    public static final String DEFAULT_CONTENT_TYPE = "application/octet-stream";
    public static final String FILE_DOWNLOAD_HTTP_HEADER = "attachment; filename=\"%s\"";
    public static final String FILE_PROPERTIES_PREFIX = "file";
    public static final String FILE_STORAGE_EXCEPTION_PATH_NOT_FOUND = "Could not create the directory where the uploaded files will be stored";
    public static final String INVALID_FILE_PATH_NAME = "Sorry! Filename contains invalid path sequence";
    public static final String FILE_NOT_FOUND = "File not found ";
    public static final String FILE_STORAGE_EXCEPTION = "Could not store file %s !! Please try again!";
    public static final CharSequence INVALID_FILE_DELIMITER = "..";
    public static final String TEMP_DIR = "C://TMP//";
    public static final String INVALID_FILE_DIMENSIONS = "Invalid file dimensions. File dimension should note be more than 300 X 300";
    public static final String INVALID_FILE_FORMAT = "Only PNG, JPEG and JPG images are allowed";
    public static final String PNG_FILE_FORMAT = ".png";
    public static final String JPEG_FILE_FORMAT = ".jpeg";
    public static final String JPG_FILE_FORMAT = ".jpg";
}
