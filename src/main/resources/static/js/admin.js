(function ($) {
    "use strict";

    // Product Category Related Variables
    var productCategory, productName, productSerialNumber, productLink, productSpecification, uploadProductImage,
        deleteProductId;

    // Promotion Related Variables
    var promotionName, promotionLink, promotionImagePath, deleteFlyerId;

    // Create New User Related Variables
    var userId, username, userEmail, password, confPassword, role, deleteUserId;

    // Create Sales Representative Related Variables
    var salesRepId, salesRepEmail, salesRepName, salesRepId, salesRepPassword, salesRepConfirmPassword,
        salesRepCompanyName, deleteSalesPersonId;

    var validEmail, validPassword;

    var selectedSalesRepIdList = [];

    var productTable, userTable, salesRepresentativeTable, flyerTable, incentivesTable;

    var baseUrl = "http://localhost:9010/";

    $('.se-pre-con').css("display", "none");

    initFunction();

    // Initialize When Page Loaded
    function initFunction() {
        $("#productCategorySelector").select2({
            placeholder: "-- Select Type --"
        });

        $("#roleSelector").select2({
            placeholder: "-- Role Name --"
        });

        $('#roleSelector').append($('<option>', {
            value: '1',
            text: 'ROLE_USER'
        }));

        $('#roleSelector').append($('<option>', {
            value: '2',
            text: 'ROLE_ADMIN'
        }));

        $("#roleSelector").select2("val", 'test');

        $("#companySelector").select2({
            placeholder: "-- Company Name --"
        });

        initDataTables();

        initUsers();

        initSalesReps();

        initProducts();

        initPromotions();

        initCategories();

    }

    function initDataTables() {
        productTable = $('#productTable').DataTable({
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            "pageLength": 5,
            "bAutoWidth": false,
            sDom: 'lrtip',
            "columnDefs": [
                {"width": "20%", "targets": 0},
                {"width": "10%", "targets": 1},
                {"width": "10%", "targets": 2},
                {"width": "25%", "targets": 3},
                {"width": "20%", "targets": 4},
                {"width": "15%", "targets": 5}
            ]
        });

        userTable = $('#userTable').DataTable({
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            "pageLength": 10,
            "bAutoWidth": false,
            sDom: 'lrtip'
        });

        salesRepresentativeTable = $('#salesRepresentativeTable').DataTable({
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            "pageLength": 10,
            "bAutoWidth": false,
            sDom: 'lrtip',
            "columnDefs": [
                {"width": "10%", "targets": 0},
                {"width": "20%", "targets": 1},
                {"width": "15%", "targets": 2},
                {"width": "20%", "targets": 3},
                {"width": "15%", "targets": 4},
                {"width": "20%", "targets": 5}
            ]
        });

        flyerTable = $('#flyerTable').DataTable({
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            "pageLength": 5,
            "bAutoWidth": false,
            sDom: 'lrtip',
            "columnDefs": [
                {"width": "10%", "targets": 0},
                {"width": "10%", "targets": 1},
                {"width": "20%", "targets": 2},
                {"width": "20%", "targets": 3},
                {"width": "10%", "targets": 4}
            ]
        });

        incentivesTable = $('#incentivesTable').DataTable({
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            "pageLength": 10,
            "bAutoWidth": true,
            sDom: 'lrtip',
            "columnDefs": [
                {"width": "35%", "targets": 0},
                {"width": "35%", "targets": 1},
                {"width": "15%", "targets": 2},
                {"width": "15%", "targets": 3}
            ]
        });
    }

    $('#promotionImagePath').on("change", function (event) {
        event.preventDefault();
        promotionImagePath = "";
    });

    function validateProductInputs() {
        var isValidInputs = true;
        $('.product-input-validate').filter(':input').each(function () {
            if (!$(this).val()) {
                isValidInputs = false;
            }
        });
        return isValidInputs;
    }

    function validatePromotionInputs() {
        var isValidInputs = true;
        $('.promotion-filed-validate').filter(':input').each(function () {
            if (!$(this).val()) {
                isValidInputs = false;
            }
        });
        return isValidInputs;
    }

    $('#addProductBtn').on("click", function (event) {
        event.preventDefault();
        var isValidInputs = validateProductInputs();
        if (isValidInputs) {
            addProductNCategory();
        } else {
            $('#productEmptyFieldError').css("display", "block");
            setTimeout(function () {
                $('#productEmptyFieldError').css("display", "none");
            }, 2000);
        }
    });

    function addProductNCategory() {
        var form = $('#fileUploadForm')[0];
        var data = new FormData(form);

        productCategory = $('#productCategory').val();
        productName = $('#productName').val();
        productSerialNumber = $('#productSerialNumber').val();
        productLink = $('#productLink').val();
        productSpecification = $('#productSpecification').val();

        var jsonDataObj = {
            'productName': productName,
            'productSerialNo': productSerialNumber,
            'productDescription': productSpecification,
            'productLink': productLink,
            'category': {
                'categoryName': productCategory
            }
        }
        data.append("productJson", JSON.stringify(jsonDataObj));

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/rest/addProduct",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (response) {
                var response = JSON.parse(response);
                var productCreationStatus = response.msg.split('-')[0];
                if (productCreationStatus === "Product creation success") {
                    $('#productCreatedSuccess').css("display", "block");
                    setTimeout(function () {
                        $('#productCreatedSuccess').css("display", "none");
                    }, 2000);
                } else {
                    $('#productAddingError').css("display", "block");
                    setTimeout(function () {
                        $('#productAddingError').css("display", "none");
                    }, 2000);
                }
                $('#add-product-modal').modal('hide');
                initProducts();
                clearAddProductCreation();
                initCategories();
                $('#productImageUploaded').css('background-image', "url(../images/upload_img1.jpg)");
            }, error: function (jqXHR, textStatus, errorThrown) {
                $('#productAddingError').css("display", "block");
                setTimeout(function () {
                    $('#productAddingError').css("display", "none");
                }, 2000);
            }
        });

        initProducts();
    }

    function initProducts() {
        $.ajax({
            type: 'GET',
            url: "/rest/getAllProducts",
            success: function (response) {
                var productList = response;
                productTable.clear().draw();
                if (productList.length > 0) {
                    for (var i = 0; i < productList.length; i++) {
                        var productObj = productList[i];
                        appendProducts(productObj);
                    }
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    }

    function initCategories() {
        $("#productCategorySelector").select2("val", '');
        $.ajax({
            type: 'GET',
            url: "/rest/getAllCategories",
            headers: {
                "Content-Type": "application/json"
            },
            success: function (response) {
                $('#productCategorySelector').empty();
                $('#productCategorySelector').append($('<option>', {
                    value: 'All',
                    text: 'All'
                }));
                var categoryList = response;
                if (categoryList.length > 0) {
                    for (var i = 0; i < categoryList.length; i++) {
                        var categoryObj = categoryList[i];
                        $('#productCategorySelector').append($('<option>', {
                            value: categoryObj.categoryName,
                            text: categoryObj.categoryName
                        }));
                    }
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error while getting categories");
            }
        });
    }

    $('#productCategorySelector').on('change', function () {
        var selectedCategory = $('#productCategorySelector').val();
        if (selectedCategory === "All") {
            $.ajax({
                type: 'GET',
                url: "/rest/getAllProducts",
                success: function (response) {
                    var productList = response;
                    productTable.clear().draw();
                    if (productList.length > 0) {
                        for (var i = 0; i < productList.length; i++) {
                            var productObj = productList[i];
                            appendProducts(productObj);
                        }
                    }
                }, error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        } else {
            $.ajax({
                type: 'GET',
                url: "/rest/getAllProductsByCategoryName?categoryName=" + selectedCategory,
                headers: {
                    "Content-Type": "application/json"
                },
                success: function (response) {
                    var productList = response;
                    productTable.clear().draw();
                    if (productList.length > 0) {
                        for (var i = 0; i < productList.length; i++) {
                            var productObj = productList[i];
                            appendProducts(productObj);
                        }
                    }
                }, error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        }
    });

    function initPromotions() {
        $.ajax({
            type: 'GET',
            url: "/rest/getAllFlyers",
            headers: {
                "Content-Type": "application/json"
            },
            success: function (response) {
                var promotionsList = response;
                flyerTable.clear().draw();
                if (promotionsList.length > 0) {
                    for (var i = 0; i < promotionsList.length; i++) {
                        var promotionsObj = promotionsList[i];
                        appendPromotions(promotionsObj);
                    }
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error while getting promotions");
            }
        });
    }

    function initUsers() {
        $.ajax({
            type: 'GET',
            url: "/rest/getAllUsers",
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                var usersList = response;
                userTable.clear().draw();
                if (response.length > 0) {
                    for (var i = 0; i < usersList.length; i++) {
                        var userObj = usersList[i];
                        appendUsers(userObj, i);
                    }
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error while getting users");
            }
        });
    }

    function initSalesReps() {
        var productsSold = 100;
        $.ajax({
            type: 'GET',
            url: "/rest/getAllSalesPersons",
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                var salesRepList = response;
                salesRepresentativeTable.clear().draw();
                if (salesRepList.length > 0) {
                    for (var i = 0; i < salesRepList.length; i++) {
                        var salesRepObj = salesRepList[i];
                        appendSalesReps(salesRepObj, i, productsSold + (i * 5), i);
                    }
                } else {
                    var emptyTBODY_TR = $('<tr>', {
                        'class': 'odd'
                    });
                    var emptyTBODY_TD = $('<td>', {
                        'class': 'dataTables_empty font-size',
                        'valign': 'top',
                        'colspan': '6'
                    });
                    emptyTBODY_TD.text("No data available in table");
                    salesRepresentativeTable.row.add($(emptyTBODY_TR)).draw();
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                var emptyTBODY_TR = $('<tr>', {
                    'class': 'odd'
                });
                var emptyTBODY_TD = $('<td>', {
                    'class': 'dataTables_empty font-size',
                    'valign': 'top',
                    'colspan': '6'
                });
                emptyTBODY_TD.text("No data available in table");
                salesRepresentativeTable.row.add($(emptyTBODY_TR)).draw();
            }
        });
    }

    function initIncentives() {
        $.ajax({
            type: 'GET',
            url: "/rest/getAllIncentives",
            success: function (response) {
                var incentiveList = response;
                incentivesTable.clear().draw();
                if (incentiveList.length > 0) {
                    for (var i = 0; i < incentiveList.length; i++) {
                        var incentiveObj = incentiveList[i];
                        appendIncentives(incentiveObj, salesRepObj);
                    }
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error while getting incentives");
            }
        });
    }

    $('#addPromotionBtn').on("click", function (event) {
        event.preventDefault();
        var isValidInputs = validatePromotionInputs();
        if (isValidInputs) {
            addPromotion();
        } else {
            $('#promotionEmptyFieldError').css("display", "block");
            setTimeout(function () {
                $('#promotionEmptyFieldError').css("display", "none");
            }, 2000);
        }
    });

    function addPromotion() {
        var form = $('#promotionFileUploadForm')[0];
        var data = new FormData(form);

        promotionName = $('#promotionName').val();
        promotionLink = $('#promotionDetailsAndLink').val();

        var jsonDataObj = {
            'flyerName': promotionName,
            'flyerLink': promotionLink
        }
        data.append("promotionJson", JSON.stringify(jsonDataObj));
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/rest/addPromotion",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (response) {
                var flyerCreationStatus = JSON.parse(response);
                if (flyerCreationStatus.msg === "Flyer creation success") {
                    $('#promotionItemAdded').css("display", "block");
                    setTimeout(function () {
                        $('#promotionItemAdded').css("display", "none");
                    }, 2000);
                } else {
                    $('#promotionItemExistsError').css("display", "block");
                    setTimeout(function () {
                        $('#promotionItemExistsError').css("display", "none");
                    }, 2000);
                }
                $('#add-promotion-modal').modal('hide');
                initPromotions();
                clearAddPromotion();
                $('#productImageUploaded').css('background-image', "url(../images/upload_img2.jpg)");
            }, error: function (jqXHR, textStatus, errorThrown) {
                $('#promotionItemAddingError').css("display", "block");
                setTimeout(function () {
                    $('#promotionItemAddingError').css("display", "none");
                }, 2000);
            }
        });

    }

    function isValidEmail(email) {
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regex.test(email)) {
            return validEmail = false;
        } else {
            return validEmail = true;

        }
    }

    $('#createPassword').keyup(function () {
        checkPasswordStrength();
    });

    $('#confirmPassword').keyup(function () {
        checkPasswordMatches($('#createPassword').val(), $('#confirmPassword').val());
    });

    $('#salesRepPassword').keyup(function () {
        checkSalesPersonPasswordStrength();
    });

    $('#salesRepConfirmPassword').keyup(function () {
        checkPasswordMatches($('#salesRepPassword').val(), $('#salesRepConfirmPassword').val());
    });

    function checkPasswordStrength() {
        var number = /([0-9])/;
        var alphabets = /([a-zA-Z])/;
        var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
        $('#password-strength-status').css('display', 'block');
        if ($('#createPassword').val().length < 6) {
            $('#password-strength-status').removeClass();
            $('#password-strength-status').addClass('weak-password');
            $('#password-strength-status').html("Weak (should be atleast 6 characters.)");
        } else {
            if ($('#createPassword').val().match(number) && $('#createPassword').val().match(alphabets) && $('#createPassword').val().match(special_characters)) {
                $('#password-strength-status').removeClass();
                $('#password-strength-status').addClass('strong-password');
                $('#password-strength-status').html("Strong");
            } else {
                $('#password-strength-status').removeClass();
                $('#password-strength-status').addClass('medium-password');
                $('#password-strength-status').html("Medium (should include alphabets, numbers and special characters.)");
            }
        }
    }

    function checkSalesPersonPasswordStrength() {
        var number = /([0-9])/;
        var alphabets = /([a-zA-Z])/;
        var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
        $('#sales-person-password-strength-status').css('display', 'block');
        if ($('#salesRepPassword').val().length < 6) {
            $('#sales-person-password-strength-status').removeClass();
            $('#sales-person-password-strength-status').addClass('weak-password');
            $('#sales-person-password-strength-status').html("Weak (should be atleast 6 characters.)");
        } else {
            if ($('#salesRepPassword').val().match(number) && $('#salesRepPassword').val().match(alphabets) && $('#salesRepPassword').val().match(special_characters)) {
                $('#sales-person-password-strength-status').removeClass();
                $('#sales-person-password-strength-status').addClass('strong-password');
                $('#sales-person-password-strength-status').html("Strong");
            } else {
                $('#sales-person-password-strength-status').removeClass();
                $('#sales-person-password-strength-status').addClass('medium-password');
                $('#sales-person-password-strength-status').html("Medium (should include alphabets, numbers and special characters.)");
            }
        }
    }

    function checkPasswordMatches(password, rePassword) {
        validPassword = false;
        if (password === rePassword) {
            validPassword = true;
        }
        return validPassword;
    }

    $("#productImageUpload").on("change", function () {
        var form = $('#fileUploadForm')[0];
        var formatData = new FormData(form);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/rest/addProductImage",
            data: formatData,
            processData: false,
            contentType: false,
            cache: false,
            success: function (response) {
                var response = JSON.parse(response);
                if (response.msg === "Image Uploaded") {
                    var productImagePath = response.productImagePath;
                    $("#productImageUploaded").css('background-image', 'none');
                    $('#productImageUploaded').css('background-image', 'url(' + productImagePath + ')');
                } else {
                    $('#productImageUploadError').css("display", "block");
                    setTimeout(function () {
                        $('#productImageUploadError').css("display", "none");
                    }, 3000);
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                $('#productImageUploadError').css("display", "block");
                setTimeout(function () {
                    $('#productImageUploadError').css("display", "none");
                }, 3000);
            }
        });
    });

    $("#add-product-modal").on("hidden.bs.modal", function () {
        $('#productImageUploaded').css('background-image', "none");
        $('#productImageUploaded').css('background-image', "url(../images/upload_img1.jpg)");
        clearAddProductCreation();
        $('#fileUploadForm').removeAttr('value');
        $('#fileUploadForm').attr('value', '');
    });

    $("#add-promotion-modal").on("hidden.bs.modal", function () {
        $('#promotionImageUploaded').css('background-image', "none");
        $('#promotionImageUploaded').height(525);
        $('#promotionImageUploaded').css('background-image', "url(../images/upload_img2.jpg)");
        clearAddPromotion();
        $('#promotionFileUploadForm').removeAttr('value');
        $('#promotionFileUploadForm').attr('value', '');
    });


    $("#uploadPromotionImage").on("change", function () {

        var form = $('#promotionFileUploadForm')[0];
        var formatData = new FormData(form);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/rest/addPromotionImage",
            data: formatData,
            processData: false,
            contentType: false,
            cache: false,
            success: function (response) {
                var response = JSON.parse(response);
                if (response.msg === "Image Uploaded") {
                    var promotionImagePath = response.promotionImagePath;
                    $('#promotionImageUploaded').css('background-image', "none");
                    $('#promotionImageUploaded').css('background-image', 'url(' + promotionImagePath + ')');
                    $('#promotionImageUploaded').height(330);
                } else {
                    $('#promotionImageUploadError').css("display", "block");
                    setTimeout(function () {
                        $('#promotionImageUploadError').css("display", "none");
                    }, 3000);
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                $('#promotionImageUploadError').css("display", "block");
                setTimeout(function () {
                    $('#promotionImageUploadError').css("display", "none");
                }, 3000);
            }
        });
    });

    $('#createSalesRep').on("click", function (event) {
        if ($('#createSalesRep').text() == "Create Sales Rep") {
            event.preventDefault();

            salesRepEmail = $('#salesRepEmail').val();
            salesRepPassword = $('#salesRepPassword').val();
            salesRepConfirmPassword = $('#salesRepConfirmPassword').val();
            salesRepCompanyName = $('#salesRepCompanyName').val();
            role = "SALES_PERSON";

            isValidEmail(salesRepEmail);

            if (validEmail && validPassword && role != "") {

                var data = {
                    "email": salesRepEmail,
                    "password": salesRepPassword,
                    "affiliateCompany": salesRepCompanyName
                }

                $.ajax({
                    type: 'POST',
                    url: "/rest/createUser?role=" + role,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(data),
                    beforeSend: function () {
                        $('.se-pre-con').css("display", "block");
                    },
                    success: function (response) {
                        $('.se-pre-con').css("display", "none");
                        if (response.msg === "User creation success") {
                            $('#salesPersonCreatedSuccess').css("display", "block");
                            setTimeout(function () {
                                $('#salesPersonCreatedSuccess').css("display", "none");
                            }, 2000);
                            initSalesReps();
                            clearSalesPersonCreation();
                        } else {
                            $('#salesPersonCreatedError').css("display", "block");
                            setTimeout(function () {
                                $('#salesPersonCreatedError').css("display", "none");
                            }, 2000);
                        }
                    }, error: function (jqXHR, textStatus, errorThrown) {
                        $('.se-pre-con').css("display", "none");
                        $('#salesPersonCreatedError').css("display", "block");
                        setTimeout(function () {
                            $('#salesPersonCreatedError').css("display", "none");
                        }, 2000);
                    }
                });
            } else {
                $('#invalidEmail').css("display", "block");
                setTimeout(function () {
                    $('#invalidEmail').css("display", "none");
                }, 2000);
            }
        } else {
            //Update Sales Person
            event.preventDefault();
            salesRepId = $('#salesRepId').val();
            salesRepEmail = $('#salesRepEmail').val();
            salesRepName = salesRepEmail.split('@')[0];
            salesRepPassword = $('#salesRepPassword').val();
            salesRepConfirmPassword = $('#salesRepConfirmPassword').val();
            salesRepCompanyName = $('#salesRepCompanyName').val();
            role = "SALES_PERSON";

            isValidEmail(salesRepEmail);

            if (validEmail && validPassword && role != "") {

                var data = {
                    "id": salesRepId,
                    "name": salesRepEmail.split('@')[0],
                    "email": salesRepEmail,
                    "password": salesRepPassword,
                    "affiliateCompany": salesRepCompanyName
                };

                $.ajax({
                    type: 'POST',
                    url: "/rest/updateUser?role=" + role,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(data),
                    beforeSend: function () {
                        $('.se-pre-con').css("display", "block");
                    },
                    success: function (response) {
                        $('.se-pre-con').css("display", "none");
                        if (response.msg === "User edited success") {
                            $('#salesPersonCreatedSuccess').css("display", "block");
                            setTimeout(function () {
                                $('#salesPersonCreatedSuccess').css("display", "none");
                            }, 2000);
                            initSalesReps();
                            clearSalesPersonCreation();
                        } else if (response === "User edited success") {
                            $('#salesPersonEditedSuccess').css("display", "block");
                            setTimeout(function () {
                                $('#salesPersonEditedSuccess').css("display", "none");
                            }, 2000);
                            initSalesReps();
                            clearSalesPersonCreation();
                        } else {
                            $('#salesPersonEditedError').css("display", "block");
                            setTimeout(function () {
                                $('#salesPersonEditedError').css("display", "none");
                            }, 2000);
                        }
                    }, error: function (jqXHR, textStatus, errorThrown) {
                        $('.se-pre-con').css("display", "none");
                        $('#salesPersonEditedError').css("display", "block");
                        setTimeout(function () {
                            $('#salesPersonEditedError').css("display", "none");
                        }, 2000);
                        console.log(textStatus)
                    }
                });
            } else {
                $('#invalidEmail').css("display", "block");
                setTimeout(function () {
                    $('#invalidEmail').css("display", "none");
                }, 2000);
            }

        }
    });

    $('#createUserAccBtn').on("click", function (event) {

        if ($('#createUserAccBtn').text() == "Create User Account") {
            event.preventDefault();

            userEmail = $('#userEmail').val();
            username = userEmail.split('@')[0];
            password = $('#createPassword').val();
            confPassword = $('#confirmPassword').val();
            role = $("#roleSelector option:selected").text();

            if (role === "") {
                $('#roleNotSelected').css("display", "block");
                setTimeout(function () {
                    $('#roleNotSelected').css("display", "none");
                }, 2000);
            }

            isValidEmail(userEmail);

            if (validEmail && validPassword && role != "") {

                var data = {
                    "email": userEmail,
                    "password": password
                }

                $.ajax({
                    type: 'POST',
                    url: "/rest/createUser?role=" + role,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(data),
                    beforeSend: function () {
                        $('.se-pre-con').css("display", "block");
                    },
                    success: function (response) {
                        $('.se-pre-con').css("display", "none");
                        if (response.msg === "User creation success") {
                            $('#userCreatedSuccess').css("display", "block");
                            setTimeout(function () {
                                $('#userCreatedSuccess').css("display", "none");
                            }, 2000);
                            initUsers();
                            clearUserCreation();
                        } else {
                            $('#userCreatedError').css("display", "block");
                            setTimeout(function () {
                                $('#userCreatedError').css("display", "none");
                            }, 2000);
                        }
                    }, error: function (jqXHR, textStatus, errorThrown) {
                        $('.se-pre-con').css("display", "none");
                        $('#userCreatedError').css("display", "block");
                        setTimeout(function () {
                            $('#userCreatedError').css("display", "none");
                        }, 2000);
                        console.log(textStatus)
                    }
                });
            } else {
                $('#invalidEmail').css("display", "block");
                setTimeout(function () {
                    $('#invalidEmail').css("display", "none");
                }, 2000);
            }
        } else {
            //Update Account Goes Here
            event.preventDefault();

            userId = $('#userId').val();
            userEmail = $('#userEmail').val();
            username = userEmail.split('@')[0];
            password = $('#createPassword').val();
            confPassword = $('#confirmPassword').val();
            role = $("#roleSelector option:selected").text();

            if (role === "") {
                $('#roleNotSelected').css("display", "block");
                setTimeout(function () {
                    $('#roleNotSelected').css("display", "none");
                }, 2000);
            }

            isValidEmail(userEmail);

            if (validEmail && validPassword && role != "") {

                var data = {
                    "id": userId,
                    "username": userEmail.split('@')[0],
                    "email": userEmail,
                    "password": password,
                    "passwordConfirm": confPassword
                }

                $.ajax({
                    type: 'POST',
                    url: "/rest/updateUser?role=" + role,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(data),
                    beforeSend: function () {
                        $('.se-pre-con').css("display", "block");
                    },
                    success: function (response) {
                        $('.se-pre-con').css("display", "none");
                        if (response.msg === "User edited success") {
                            $('#userCreatedSuccess').css("display", "block");
                            setTimeout(function () {
                                $('#userCreatedSuccess').css("display", "none");
                            }, 2000);
                            initUsers();
                            clearUserCreation();
                        } else if (response === "User edited success") {
                            $('#userEditedSuccess').css("display", "block");
                            setTimeout(function () {
                                $('#userEditedSuccess').css("display", "none");
                            }, 2000);
                            initUsers();
                            clearUserCreation();
                        } else {
                            $('#userEditedError').css("display", "block");
                            setTimeout(function () {
                                $('#userEditedError').css("display", "none");
                            }, 2000);
                        }
                    }, error: function (jqXHR, textStatus, errorThrown) {
                        $('.se-pre-con').css("display", "none");
                        $('#userEditedError').css("display", "block");
                        setTimeout(function () {
                            $('#userEditedError').css("display", "none");
                        }, 2000);
                        console.log(textStatus)
                    }
                });
            } else {
                $('#invalidEmail').css("display", "block");
                setTimeout(function () {
                    $('#invalidEmail').css("display", "none");
                }, 2000);
            }

        }
    });

    $('#createSalesRep').on("click", function (event) {
        event.preventDefault();
        salesRepName = $('#salesRepName').val();
        salesRepId = $('#salesRepId').val();
        salesRepPassword = $('#salesRepPassword').val();
        salesRepConfirmPassword = $('#salesRepConfirmPassword').val();
        salesRepCompanyName = $('#salesRepCompanyName').val();

    });

    $("#addSalesRepBtn").on("click", function (event) {
        event.preventDefault();
        clearSalesPersonCreation();
        $('#createSalesRep').text('Create Sales Rep');
        $('.sales-rep-input').prop("disabled", false);
    });

    $("#clearSalesRepFormBtn").on("click", function (event) {
        event.preventDefault();
        $('#createSalesRep').text('Create Sales Rep');
        clearSalesPersonCreation();
        $('.sales-rep-input').prop("disabled", true);
    });

    $("#addNewUserBtn").on("click", function (event) {
        event.preventDefault();
        $('#createUserAccBtn').text('Create User Account');
        clearUserCreation();
        $('.sales-user-input').prop("disabled", false);
    });

    function clearUserCreation() {
        $('#userEmail').val('');
        $('#userId').val('');
        $('#createPassword').val('');
        $('#confirmPassword').val('');
        $('#password-strength-status').removeClass();
        $('#password-strength-status').css('display', 'none');
    }

    function clearSalesPersonCreation() {
        $('#salesRepEmail').val('');
        $('#salesRepId').val('');
        $('#salesRepPassword').val('');
        $('#salesRepConfirmPassword').val('');
        $('#salesRepCompanyName').val('');
        $('#sales-person-password-strength-status').removeClass();
        $('#sales-person-password-strength-status').css('display', 'none');
    }

    function clearAddProductCreation() {
        $('#productCategory').val('');
        $('#productName').val('');
        $('#productSerialNumber').val('');
        $('#productLink').val('');
        $('#productSpecification').val('');
    }

    function clearAddPromotion() {
        $('#promotionName').val('');
        $('#promotionDetailsAndLink').val('');
    }

    $("#clearUserAccountFormBtn").on("click", function (event) {
        event.preventDefault();
        clearUserCreation();
        $('#createUserAccBtn').text('Create User Account');
        $('.sales-user-input').prop("disabled", true);
    });

    $('#logOutTxt').on('click', function () {

    });

    $('#logOutBtn').on('click', function () {

    });

    // Completed
    function appendProducts(productObj) {

        var productTBODY_TR = $('<tr>', {
            'id': productObj.productId + '-product-row'
        });

        var productCategoryTR_TD = $('<td>', {});

        var productCategoryParentDiv = $('<div>', {
            'class': 'row justify-content-between product-title-row'
        });

        var productCategoryWrapperDiv1 = $('<div>', {
            'class': 'category-name-div1'
        });

        var productCategoryName = $('<span>', {
            'class': 'product-category-title-span font-size'
        });
        productCategoryName.text(productObj.category);

        var productCategoryWrapperDiv2 = $('<div>', {
            'class': 'category-name-div2',
            'id': productObj.productId + '-remove-product'
        }).on('click', function (event) {
            deleteProductId = event.currentTarget.id.split('-')[0];
            $('#deleteProductModal').modal('show');
        });

        var productCategoryRemove = $('<i>', {
            'class': 'fa fa-trash'
        });

        productCategoryWrapperDiv1.append(productCategoryName);
        productCategoryWrapperDiv2.append(productCategoryRemove);
        productCategoryParentDiv.append(productCategoryWrapperDiv1);
        productCategoryParentDiv.append(productCategoryWrapperDiv2);
        productCategoryTR_TD.append(productCategoryParentDiv)

        var productNameTR_TD = $('<td>', {});
        productNameTR_TD.text(productObj.productName);

        var productSerialTR_TD = $('<td>', {});
        productSerialTR_TD.text(productObj.productSerialNo);

        var productDescriptionTR_TD = $('<td>', {});
        productDescriptionTR_TD.text(productObj.productDescription);

        var productLinkTR_TD = $('<td>', {});

        var productLinkA = $('<a>', {
            'href': productObj.productLink
        });
        productLinkA.text(productObj.productLink);

        productLinkTR_TD.append(productLinkA);

        var productImageTR_TD = $('<td>', {
            'style': "text-align: center;"
        });

        var productImage = $('<img>', {
            'class': 'product-img',
            'src': productObj.productImagePath
        });

        productImageTR_TD.append(productImage);

        productTBODY_TR.append(productCategoryTR_TD);
        productTBODY_TR.append(productNameTR_TD);
        productTBODY_TR.append(productSerialTR_TD);
        productTBODY_TR.append(productDescriptionTR_TD);
        productTBODY_TR.append(productLinkTR_TD);
        productTBODY_TR.append(productImageTR_TD);

        productTable.row.add($(productTBODY_TR)).draw();
    }

    // Not Done
    function appendPromotions(promotionObj) {

        var promotionsTBODY_TR = $('<tr>', {
            'id': promotionObj.flyerId + '-promotions-row'
        });

        var promotionsNumber_TD = $('<td>', {});

        var promotionsNumberSpan = $('<span>', {
            'class': 'font-size'
        });
        promotionsNumberSpan.text(promotionObj.flyerId);

        promotionsNumber_TD.append(promotionsNumberSpan);

        var promotionsTitle_TD = $('<td>', {});

        var promotionsNameSpan = $('<span>', {
            'class': 'font-size'
        });
        promotionsNameSpan.text(promotionObj.flyerName);

        promotionsTitle_TD.append(promotionsNameSpan);

        var promotionLink_TD = $('<td>', {});

        var promotionLinkA = $('<a>', {
            'href': promotionObj.flyerLink
        });
        promotionLinkA.text(promotionObj.flyerLink);

        promotionLink_TD.append(promotionLinkA);

        var promotionFlyerImage_TD = $('<td>', {
            'class': 'td-img'
        });

        var promotionFlyerImage = $('<img>', {
            'class': 'flyer-image',
            'src': promotionObj.flyerImagePath
        });

        promotionFlyerImage_TD.append(promotionFlyerImage);

        var promotionEditDelete_TD = $('<td>', {});

        var promotionActionParentDiv = $('<div>', {
            'class': 'row justify-content-between product-title-row flyer-action'
        });

        var promotionEditDiv = $('<div>', {
            'class': 'col-2 product-category-titles',
            'id': promotionObj.flyerId + '-edit-flyer'
        }).on('click', function (event) {
            var editFlyerId = event.currentTarget.id.split('-')[0];
        });

        var promotionEdit = $('<i>', {
            'class': 'fa fa-pencil-square-o'
        });

        promotionEditDiv.append(promotionEdit);

        var promotionDeleteDiv = $('<div>', {
            'class': 'col-2',
            'id': promotionObj.flyerId + '-remove-flyer',
            'style': 'margin-right: 20%;'
        }).on('click', function (event) {
            deleteFlyerId = event.currentTarget.id.split('-')[0];
            $('#view-promotions-modal').modal('hide');
            $('#deleteFlyerModal').modal('show');
        });

        var promotionRemove = $('<i>', {
            'class': 'fa fa-trash'
        });

        promotionDeleteDiv.append(promotionRemove);

        promotionActionParentDiv.append(promotionEditDiv);
        promotionActionParentDiv.append(promotionDeleteDiv);
        promotionEditDelete_TD.append(promotionActionParentDiv);

        promotionsTBODY_TR.append(promotionsNumber_TD);
        promotionsTBODY_TR.append(promotionsTitle_TD);
        promotionsTBODY_TR.append(promotionLink_TD);
        promotionsTBODY_TR.append(promotionFlyerImage_TD);
        promotionsTBODY_TR.append(promotionEditDelete_TD);

        flyerTable.row.add($(promotionsTBODY_TR)).draw();
    }

    // Completed
    function appendUsers(userObj, index) {

        var userTBODY_TR = $('<tr>', {
            'id': userObj.userId + '-user-row'
        });

        if (index % 2 == 0) {
            userTBODY_TR.addClass('odd')
        } else {
            userTBODY_TR.addClass('even')
        }

        var userName_TD = $('<td>', {});

        var userNameSpan = $('<span>', {
            'class': 'font-size'
        });
        userNameSpan.text(userObj.username);

        userName_TD.append(userNameSpan);

        var userId_TD = $('<td>', {});

        var userIdSpan = $('<span>', {
            'class': 'font-size'
        });
        userIdSpan.text(userObj.userId);

        userId_TD.append(userIdSpan);

        var userEditDelete_TD = $('<td>', {});

        var userActionParentDiv = $('<div>', {
            'class': 'row justify-content-between product-title-row flyer-action'
        });

        var userEditDiv = $('<div>', {
            'class': 'col-2 product-category-titles',
            'id': userObj.userId + '-user-edit'
        }).on('click', function (event) {
            var userId = event.currentTarget.id.split('-')[0];
            getUserById(userId);
        });

        var userEdit = $('<i>', {
            'class': 'fa fa-pencil-square-o'
        });

        userEditDiv.append(userEdit);

        var userDeleteDiv = $('<div>', {
            'class': 'col-2',
            'id': userObj.userId + '-delete-user',
            'style': 'margin-right: 10px;'
        }).on('click', function (event) {
            deleteUserId = event.currentTarget.id.split('-')[0];
            $('#deleteUserModal').modal('show');
        });

        var userRemove = $('<i>', {
            'class': 'fa fa-trash'
        });

        userDeleteDiv.append(userRemove);

        userActionParentDiv.append(userEditDiv);
        userActionParentDiv.append(userDeleteDiv);
        userEditDelete_TD.append(userActionParentDiv);

        userTBODY_TR.append(userName_TD);
        userTBODY_TR.append(userId_TD);
        userTBODY_TR.append(userEditDelete_TD);

        userTable.row.add($(userTBODY_TR)).draw();
    }

    // Ongoing Multiple Select Delete
    function appendSalesReps(salesRepObj, rank, productsSold, index) {

        var salesRepTBODY_TR = $('<tr>', {
            'id': salesRepObj.salesPersonId + '-sales-rep-row'
        });

        if (index % 2 == 0) {
            salesRepTBODY_TR.addClass('odd')
        } else {
            salesRepTBODY_TR.addClass('even')
        }

        var salesRepRank_TD = $('<td>', {
            'class': 'td-img'
        });

        var salesRepSpan = $('<span>', {
            'class': 'font-weight-600 font-size'
        });
        salesRepSpan.text(rank);

        salesRepRank_TD.append(salesRepSpan);

        var salesRepName_TD = $('<td>', {});

        var salesRepNameSpan = $('<span>', {
            'class': 'font-size'
        });
        salesRepNameSpan.text(salesRepObj.salesPersonName);

        salesRepName_TD.append(salesRepNameSpan);

        var salesRepId_TD = $('<td>', {});

        var salesRepIdSpan = $('<span>', {
            'class': 'font-size'
        });
        salesRepIdSpan.text(salesRepObj.salesPersonId);

        salesRepId_TD.append(salesRepIdSpan);

        var salesRepAffiliateCompany_TD = $('<td>', {});

        var salesRepAffiliateCompanySpan = $('<span>', {
            'class': 'font-size'
        });
        salesRepAffiliateCompanySpan.text(salesRepObj.affiliateCompany);

        salesRepAffiliateCompany_TD.append(salesRepAffiliateCompanySpan);

        var salesRepProductsSold_TD = $('<td>', {});

        var salesRepProductsSoldSpan = $('<span>', {
            'class': 'font-size'
        });
        salesRepProductsSoldSpan.text(productsSold);

        salesRepProductsSold_TD.append(salesRepProductsSoldSpan);

        var salesRepEditDelete_TD = $('<td>', {});

        var salesRepActionParentDiv = $('<div>', {
            'class': 'row sales-rep-row'
        });

        var salesRepEditDiv = $('<div>', {
            'class': ' col',
            'id': salesRepObj.salesPersonId + '-edit-sales-rep'
        }).on('click', function (event) {
            var salesPersonId = event.currentTarget.id.split('-')[0];
            getSalesPersonById(salesPersonId);
        });

        var salesRepEdit = $('<i>', {
            'class': 'fa fa-pencil-square-o'
        });

        salesRepEditDiv.append(salesRepEdit);

        var salesRepDeleteDiv = $('<div>', {
            'class': ' col',
            'id': salesRepObj.salesPersonId + '-delete-sales-rep'
        }).on('click', function (event) {
            deleteSalesPersonId = event.currentTarget.id.split('-')[0];
            $('#deleteSalesRepModal').modal('show');
        });

        var salesRepRemove = $('<i>', {
            'class': 'fa fa-trash'
        });

        salesRepDeleteDiv.append(salesRepRemove);

        var salesRepCheckBoxDiv = $('<div>', {
            'class': ' col'
        });

        var salesRepCheckBoxRemove = $('<input>', {
            'class': 'form-check-input',
            'type': 'checkbox',
            'id': salesRepObj.salesPersonId + '-checkbox-sales-rep'
        }).on('click', function (event) {
            var salesPersonId = event.currentTarget.id.split('-')[0];
            if ($(this).is(":checked")) {
                selectedSalesRepIdList.push(salesPersonId);
            } else if ($(this).is(":not(:checked)")) {
                selectedSalesRepIdList.pop(salesPersonId);
            }
        });

        salesRepCheckBoxDiv.append(salesRepCheckBoxRemove);

        salesRepActionParentDiv.append(salesRepEditDiv);
        salesRepActionParentDiv.append(salesRepDeleteDiv);
        salesRepActionParentDiv.append(salesRepCheckBoxDiv);

        salesRepEditDelete_TD.append(salesRepActionParentDiv);

        salesRepTBODY_TR.append(salesRepRank_TD);
        salesRepTBODY_TR.append(salesRepName_TD);
        salesRepTBODY_TR.append(salesRepId_TD);
        salesRepTBODY_TR.append(salesRepAffiliateCompany_TD);
        salesRepTBODY_TR.append(salesRepProductsSold_TD);
        salesRepTBODY_TR.append(salesRepEditDelete_TD);

        salesRepresentativeTable.row.add($(salesRepTBODY_TR)).draw();
    }

    $('#deleteProductBtn').on('click', function () {
        deleteProduct(deleteProductId);
        $('#deleteProductModal').modal('hide');
    });

    $('#deleteUserBtn').on('click', function () {
        deleteUser(deleteUserId);
        $('#deleteUserModal').modal('hide');
    });

    $('#deleteSalesRepBtn').on('click', function () {
        deleteSalesPerson(deleteSalesPersonId);
        $('#deleteSalesRepModal').modal('hide');
    });

    $('#bulkDeleteSalesRep').on('click', function () {
        $('#bulkDeleteSalesRepModal').modal('show');
    });

    $('#bulkDeleteSalesRepBtn').on('click', function () {
        if (selectedSalesRepIdList.length > 0) {
            bulkDeleteSalesPerson(selectedSalesRepIdList);
            $('#bulkDeleteSalesRepModal').modal('hide');
            selectedSalesRepIdList = [];
        } else {
            $('#bulkSalesRepDeleteNonSelectedError').css("display", "block");
            setTimeout(function () {
                $('#bulkSalesRepDeleteNonSelectedError').css("display", "none");
            }, 2000);
            $('#bulkDeleteSalesRepModal').modal('hide');
        }
    });

    $('#deleteFlyerBtn').on('click', function () {
        deleteFlyer(deleteFlyerId);
        $('#deleteFlyerModal').modal('hide');
    });

    // Not Done
    function appendIncentives(incentiveObj, salesRepObj) {

        var incentiveTBODY_TR = $('<tr>', {
            'id': incentiveObj.incentiveId + '-incentive-row'
        });

        var salesRepId_TD = $('<td>', {});

        var salesRepIdSpan = $('<span>', {
            'class': 'font-size'
        });
        salesRepIdSpan.text(salesRepObj.userId);

        salesRepId_TD.append(salesRepIdSpan);

        var soldProducts_TD = $('<td>', {});

        var productsSoldSpan = $('<span>', {
            'class': 'font-size'
        });
        productsSoldSpan.text(salesRepObj.productsSold);

        soldProducts_TD.append(productsSoldSpan);

        var incentiveEdit_TD = $('<td>', {});

        var incentiveEditDiv = $('<div>', {
            'class': 'td-img',
            'id': incentiveObj.incentiveId + '-edit-incentive'
        }).on('click', function (event) {

        });

        var incentiveEdit = $('<i>', {
            'class': 'fa fa-pencil-square-o'
        });

        incentiveEditDiv.append(incentiveEdit);
        incentiveEdit_TD.append(incentiveEditDiv);

        var incentiveDelete_TD = $('<td>', {});

        var incentiveDeleteDiv = $('<div>', {
            'class': 'td-img',
            'id': incentiveObj.incentiveId + '-delete-incentive'
        }).on('click', function (event) {

        });

        var incentiveDelete = $('<i>', {
            'class': 'fa fa-trash'
        });

        incentiveDeleteDiv.append(incentiveDelete);
        incentiveDelete_TD.append(incentiveDeleteDiv);

        incentiveTBODY_TR.append(salesRepId_TD);
        incentiveTBODY_TR.append(soldProducts_TD);
        incentiveTBODY_TR.append(incentiveEdit_TD);
        incentiveTBODY_TR.append(incentiveDelete_TD);

        incentivesTable.row.add($(incentiveTBODY_TR)).draw();
    }

    function getUserById(userId) {
        $.ajax({
            type: 'POST',
            url: "/rest/getUserById?userId=" + userId,
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                var userObj = response;
                editUserForm(userObj);
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("No records to display");
            }
        });
    }

    function getSalesPersonById(salesPersonId) {
        $.ajax({
            type: 'POST',
            url: "/rest/getUserById?userId=" + salesPersonId,
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                var salesPersonObj = response;
                editSalesPersonForm(salesPersonObj);
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("No records to display");
            }
        });
    }

    function deleteProduct(deleteProductId) {
        $.ajax({
            type: 'POST',
            url: "/rest/deleteProductById?productId=" + deleteProductId,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function () {
                $('.se-pre-con').css("display", "block");
            },
            success: function (response) {
                $('.se-pre-con').css("display", "none");
                var deletedObj = response;
                if (deletedObj.msg === "Product Delete Success") {
                    initProducts();
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("No records to display");
            }
        });
    }

    function deleteUser(userId) {
        $.ajax({
            type: 'POST',
            url: "/rest/deleteUserById?userId=" + userId,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function () {
                $('.se-pre-con').css("display", "block");
            },
            success: function (response) {
                var deletedObj = response;
                $('.se-pre-con').css("display", "none");
                if (deletedObj.msg === "User Delete Success") {
                    initUsers();
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("No records to display");
                $('.se-pre-con').css("display", "none");
            }
        });
    }

    function deleteSalesPerson(salesPersonId) {
        $.ajax({
            type: 'POST',
            url: "/rest/deleteUserById?userId=" + salesPersonId,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function () {
                $('.se-pre-con').css("display", "block");
            },
            success: function (response) {
                $('.se-pre-con').css("display", "none");
                var deletedObj = response;
                if (deletedObj.msg === "User Delete Success") {
                    initSalesReps();
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                $('.se-pre-con').css("display", "none");
                console.log("No records to display");
            }
        });
    }

    function bulkDeleteSalesPerson(salesPersonList) {
        $.ajax({
            type: 'POST',
            url: "/rest/deleteUsersWithIds?salesRepIdList=" + salesPersonList,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function () {
                $('.se-pre-con').css("display", "block");
            },
            success: function (response) {
                var deletedObj = response;
                $('.se-pre-con').css("display", "none");
                if (deletedObj.msg === "Sales Person List Delete Success") {
                    initSalesReps();
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                $('.se-pre-con').css("display", "none");
                console.log("No records to display");
            }
        });

    }

    function deleteFlyer(deleteFlyerId) {
        $.ajax({
            type: 'POST',
            url: "/rest/deleteFlyerById?flyerId=" + deleteFlyerId,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function () {
                $('.se-pre-con').css("display", "block");
            },
            success: function (response) {
                $('.se-pre-con').css("display", "none");
                var deletedObj = response;
                if (deletedObj.msg === "Flyer Deleted Success") {
                    initPromotions();
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                $('.se-pre-con').css("display", "none");
                console.log("No records to display");
            }
        });
    }

    function editUserForm(userObj) {
        $('.sales-user-input').prop("disabled", false);
        $('#userEmail').val(userObj.emailAddress);
        $('#userId').val(userObj.userId);
        if (userObj.userRole === "ROLE_USER") {
            $("#roleSelector option[value='" + 1 + "']").attr("selected", "selected");
        } else {
            $("#roleSelector option[value='" + 2 + "']").attr("selected", "selected");
        }
        $('#createUserAccBtn').text("Edit User Account");
    }

    function editSalesPersonForm(salesPersonObj) {
        $('.sales-rep-input').prop("disabled", false);
        $('#salesRepEmail').val(salesPersonObj.emailAddress);
        $('#salesRepId').val(salesPersonObj.userId);
        $('#salesRepCompanyName').val(salesPersonObj.affiliateCompany);
        $('#createSalesRep').text("Edit Sales Person Account");
    }

})(jQuery);