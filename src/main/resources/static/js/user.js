(function ($) {
    "use strict";

    // Product Category Related Variables
    var productCategory, productName, productSerialNumber, productLink, productSpecification, uploadProductImage;

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

    function initProducts() {
        $.ajax({
            type: 'GET',
            url: baseUrl + "getAllProducts",
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
            url: baseUrl + "getAllCategories",
            headers: {
                "Content-Type": "application/json"
            },
            success: function (response) {
                var categoryList = response;
                if (categoryList.length > 0) {
                    for (var i = 0; i < categoryList.length; i++) {
                        var categoryObj = categoryList[i];
                        $('#productCategorySelector').append($('<option>', {
                            value: categoryObj.id,
                            text: categoryObj.categoryName
                        }));
                    }
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("No records to display");
            }
        });
    }

    function initPromotions() {
        $.ajax({
            type: 'GET',
            url: baseUrl + "getAllFlyers",
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

            }
        });
    }

    function initUsers() {
        $.ajax({
            type: 'GET',
            url: baseUrl + "getAllUsers",
            headers: {
                "Content-Type": "application/json"
            },
            success: function (response) {
                var usersList = response;
                userTable.clear().draw();
                if (usersList.length > 0) {
                    for (var i = 0; i < usersList.length; i++) {
                        var userObj = usersList[i];
                        appendUsers(userObj, i);
                    }
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("No records to display");
            }
        });
    }

    function initSalesReps() {
        var productsSold = 100;
        $.ajax({
            type: 'GET',
            url: baseUrl + "getAllSalesPersons",
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
                        'class': 'dataTables_empty',
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
                    'class': 'dataTables_empty',
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
            url: "/rest/incentives/getAllIncentives",
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
                console.log("No records to display");
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
                    "emailAddress": salesRepEmail,
                    "password": salesRepPassword,
                    "passwordConfirm": salesRepConfirmPassword,
                    "affiliateCompany": salesRepCompanyName
                }

                $.ajax({
                    type: 'POST',
                    url: baseUrl + "createUser?role=" + role,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(data),
                    beforeSend: function () {
                        $('.se-pre-con').css("display", "block");
                    },
                    success: function (response) {
                        $('.se-pre-con').css("display", "none");
                        if (response === "User creation success") {
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
            //Update Sales Person
            event.preventDefault();

            salesRepId = $('#salesRepId').val();
            salesRepEmail = $('#salesRepEmail').val();
            salesRepName = salesRepEmail.split('@')[0];
            salesRepPassword = $('#salesRepPassword').val();
            salesRepConfirmPassword = $('#salesRepConfirmPassword').val();
            salesRepCompanyName = $('#salesRepCompanyName').val();
            role = "SALES_PERSON";

            isValidEmail(userEmail);

            if (validEmail && validPassword && role != "") {

                var data = {
                    "id": salesRepId,
                    "username": salesRepEmail.split('@')[0],
                    "emailAddress": salesRepEmail,
                    "password": salesRepPassword,
                    "passwordConfirm": salesRepConfirmPassword,
                    "affiliateCompany": salesRepCompanyName
                }

                $.ajax({
                    type: 'POST',
                    url: baseUrl + "updateUser?role=" + role,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(data),
                    beforeSend: function () {
                        $('.se-pre-con').css("display", "block");
                    },
                    success: function (response) {
                        $('.se-pre-con').css("display", "none");
                        if (response === "User creation success") {
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

    $("#addNewUserBtn, #createUserAccBtn").on("click", function (event) {
        $('#userPermissionsNotGranted').css("display", "block");
        setTimeout(function () {
            $('#userPermissionsNotGranted').css("display", "none");
        }, 4000);
    });

    function clearSalesPersonCreation() {
        $('#salesRepEmail').val('');
        $('#salesRepId').val('');
        $('#salesRepPassword').val('');
        $('#salesRepConfirmPassword').val('');
        $('#salesRepCompanyName').val('');
        $('#sales-person-password-strength-status').removeClass();
        $('#sales-person-password-strength-status').css('display', 'none');
    }

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
            'class': 'product-category-title-span'
        });
        productCategoryName.text(productObj.category);

        var productCategoryWrapperDiv2 = $('<div>', {
            'class': 'category-name-div2',
            'id': productObj.id + '-remove-product'
        }).on('click', function (event) {
            $('#userPermissionsNotGranted').css("display", "block");
            setTimeout(function () {
                $('#userPermissionsNotGranted').css("display", "none");
            }, 4000);
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

        var promotionsNumberSpan = $('<span>', {});
        promotionsNumberSpan.text(promotionObj.flyerId);

        promotionsNumber_TD.append(promotionsNumberSpan);

        var promotionsTitle_TD = $('<td>', {});

        var promotionsNameSpan = $('<span>', {});
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
            $('#userPermissionsNotGranted').css("display", "block");
            setTimeout(function () {
                $('#userPermissionsNotGranted').css("display", "none");
            }, 4000);
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
            $('#userPermissionsNotGranted').css("display", "block");
            setTimeout(function () {
                $('#userPermissionsNotGranted').css("display", "none");
            }, 4000);
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

        var userNameSpan = $('<span>', {});
        userNameSpan.text(userObj.username);

        userName_TD.append(userNameSpan);

        var userId_TD = $('<td>', {});

        var userIdSpan = $('<span>', {});
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
            $('#userPermissionsNotGranted').css("display", "block");
            setTimeout(function () {
                $('#userPermissionsNotGranted').css("display", "none");
            }, 4000);
        });

        var userEdit = $('<i>', {
            'class': 'fa fa-pencil-square-o'
        });

        userEditDiv.append(userEdit);

        var userDeleteDiv = $('<div>', {
            'class': 'col-2',
            'id': userObj.userId + '-delete-user'
        }).on('click', function (event) {
            $('#userPermissionsNotGranted').css("display", "block");
            setTimeout(function () {
                $('#userPermissionsNotGranted').css("display", "none");
            }, 4000);
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
            'class': 'font-weight-600'
        });
        salesRepSpan.text(rank);

        salesRepRank_TD.append(salesRepSpan);

        var salesRepName_TD = $('<td>', {});

        var salesRepNameSpan = $('<span>', {});
        salesRepNameSpan.text(salesRepObj.salesPersonName);

        salesRepName_TD.append(salesRepNameSpan);

        var salesRepId_TD = $('<td>', {});

        var salesRepIdSpan = $('<span>', {});
        salesRepIdSpan.text(salesRepObj.salesPersonId);

        salesRepId_TD.append(salesRepIdSpan);

        var salesRepAffiliateCompany_TD = $('<td>', {});

        var salesRepAffiliateCompanySpan = $('<span>', {});
        salesRepAffiliateCompanySpan.text(salesRepObj.affiliateCompany);

        salesRepAffiliateCompany_TD.append(salesRepAffiliateCompanySpan);

        var salesRepProductsSold_TD = $('<td>', {});

        var salesRepProductsSoldSpan = $('<span>', {});
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

    $('#deleteSalesRepBtn').on('click', function () {
        deleteSalesPerson(deleteSalesPersonId);
        $('#deleteSalesRepModal').modal('hide');
    });

    $('#bulkDeleteSalesRep').on('click', function () {
        $('#bulkDeleteSalesRepModal').modal('show');
    });

    $('#bulkDeleteSalesRepBtn').on('click', function () {
        bulkDeleteSalesPerson(selectedSalesRepIdList);
        $('#bulkDeleteSalesRepModal').modal('hide');
        selectedSalesRepIdList = [];
    });

    // Not Done
    function appendIncentives(incentiveObj, salesRepObj) {

        var incentiveTBODY_TR = $('<tr>', {
            'id': incentiveObj.incentiveId + '-incentive-row'
        });

        var salesRepId_TD = $('<td>', {});

        var salesRepIdSpan = $('<span>', {});
        salesRepIdSpan.text(salesRepObj.userId);

        salesRepId_TD.append(salesRepIdSpan);

        var soldProducts_TD = $('<td>', {});

        var productsSoldSpan = $('<span>', {});
        productsSoldSpan.text(salesRepObj.productsSold);

        soldProducts_TD.append(productsSoldSpan);

        var incentiveEdit_TD = $('<td>', {});

        var incentiveEditDiv = $('<div>', {
            'class': 'td-img',
            'id': incentiveObj.incentiveId + '-edit-incentive'
        }).on('click', function (event) {
            $('#userPermissionsNotGranted').css("display", "block");
            setTimeout(function () {
                $('#userPermissionsNotGranted').css("display", "none");
            }, 4000);
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
            $('#userPermissionsNotGranted').css("display", "block");
            setTimeout(function () {
                $('#userPermissionsNotGranted').css("display", "none");
            }, 4000);
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
            url: baseUrl + "getUserById?userId=" + userId,
            headers: {
                "Content-Type": "application/json"
            },
            success: function (response) {
                var userObj = JSON.parse(response);
                editUserForm(userObj);
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("No records to display");
            }
        });
    }

    function getSalesPersonById(salesPersonId) {
        $.ajax({
            type: 'POST',
            url: baseUrl + "getUserById?userId=" + salesPersonId,
            headers: {
                "Content-Type": "application/json"
            },
            success: function (response) {
                var salesPersonObj = JSON.parse(response);
                editSalesPersonForm(salesPersonObj);
            }, error: function (jqXHR, textStatus, errorThrown) {
                console.log("No records to display");
            }
        });
    }

    $('#userAddProduct').on('click', function () {
        $('#userPermissionsNotGranted').css("display", "block");
        setTimeout(function () {
            $('#userPermissionsNotGranted').css("display", "none");
        }, 4000);
    });

    $('#userAddPromotion').on('click', function () {
        $('#userPermissionsNotGranted').css("display", "block");
        setTimeout(function () {
            $('#userPermissionsNotGranted').css("display", "none");
        }, 4000);
    });

    function deleteSalesPerson(salesPersonId) {
        $.ajax({
            type: 'POST',
            url: baseUrl + "deleteUserById?userId=" + salesPersonId,
            headers: {
                "Content-Type": "application/json"
            },
            beforeSend: function () {
                $('.se-pre-con').css("display", "block");
            },
            success: function (response) {
                $('.se-pre-con').css("display", "none");
                var deletedObj = JSON.parse(response);
                if (deletedObj.status === "User Delete Success") {
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
            url: baseUrl + "deleteUsersWithIds?salesRepIdList=" + salesPersonList,
            headers: {
                "Content-Type": "application/json"
            },
            beforeSend: function () {
                $('.se-pre-con').css("display", "block");
            },
            success: function (response) {
                $('.se-pre-con').css("display", "none");
                var deletedObj = JSON.parse(response);
                if (deletedObj.status === "Sales Person List Delete Success") {
                    initSalesReps();
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                $('.se-pre-con').css("display", "none");
                console.log("No records to display");
            }
        });

    }

})(jQuery);