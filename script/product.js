let createProductRequest;
let getProductsRequest;
let updateProductRequest;
let deleteProductRequest;

/**
 * initialization
 */
(function () {
    'use strict'

    // Register submit event createProductForm
    $('#createProductForm').on('submit', createProduct);

    // Render initial table
    renderProductTable();

    // Register shown.bs.modal event of editProductModal
    $('#editProductModal').on('shown.bs.modal', populateEditProductForm);

    // Register submit event of editProductForm
    $('#editProductForm').on('submit', updateProduct);

    // Register click event of deleteProductButton
    $('#deleteProductButton').on('click', deleteProduct);
})()

/**
 * create product when createProductForm form is submitted
 */
function createProduct() {
    // cancel submit if the form is invalid.
    if (!document.getElementById('createProductForm').checkValidity()) {
        console.log('One of the inputs in create product form is invalid.');
        return;
    }
    // abort any pending request
    if (createProductRequest) {
        createProductRequest.abort();
    }
    // select and cache all the fields
    const $inputs = $('#createProductForm').find("input, select, button, textarea");
    // disable the inputs for the duration of the ajax request
    $inputs.prop('disabled', true);
    // serialize the data of the form in JSON
    const formJsonData = JSON.stringify(getCreateProductFormData());
    // fire off the request
    createProductRequest = $.ajax({
        url: backendBaseUrl + "/product",
        type: "post",
        contentType: "application/json",
        dataType: 'json',
        // async: false,
        data: formJsonData
    });
    // callback handler that will be called on success
    createProductRequest.done(function () {
        console.log("Product created.");
        renderProductTable();
    });
    // callback handler that will be called on failure
    createProductRequest.fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error occurred during product creation: " + textStatus, errorThrown);
    })
    // callback handler that will be called regardless the request succeeded or not
    createProductRequest.always(function () {
        $inputs.prop("disabled", false);
    });
}

/**
 * get values from inputs of createProductForm form
 * @returns {{serialNumber: (*|string|jQuery), minimumOrderQuantity: string, name: (*|string|jQuery), type: (*|string|jQuery)}}
 */
function getCreateProductFormData(){
    return {
        serialNumber: $("#createProductSerialNumberTextInput").val(),
        type: $("#createProductTypeTextInput").val(),
        name: $("#createProductNameTextInput").val(),
        minimumOrderQuantity: parseFloat($("#createProductMinimumOrderQuantityTextInput").val()).toFixed(3)
    }
}

/**
 * render product table
 */
function renderProductTable() {
    // abort any pending request
    if (getProductsRequest) {
        getProductsRequest.abort();
    }
    // fire off the request
    getProductsRequest = $.ajax({
        url: backendBaseUrl + "/products",
        type: "get",
        // async: false
    });
    // callback handler that will be called on success
    getProductsRequest.done(function (response) {
        $('#productTableBody tr').remove();
        renderProductTableBody(response.products);
    });
    // callback handler that will be called on failure
    getProductsRequest.fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error occurred during get all products: " + textStatus, errorThrown);
    })
    // callback handler that will be called regardless the request succeeded or not
    getProductsRequest.always(function () {

    });
}

/**
 * render product table body
 * @param products
 */
function renderProductTableBody(products) {
    const tbody = $('#productTableBody');
    for (const product of products) {
        tbody.append('<td data-bs-toggle="modal" data-bs-target="#editProductModal">' +
            '<td class="productTableRowId">' + product.id + '</td>' +
            '<td class="productTableRowSerialNumber">' + product.serialNumber + '</td>' +
            '<td class="productTableRowType">' + product.type + '</td>' +
            '<td class="productTableRowName">' + product.name + '</td>' +
            '<td class="productTableRowMinimumOrderQuantity">' + product.minimumOrderQuantity + '</td>' +
            '<td class="productTableRowBomEntryCount">' + product.bomEntryCount + '</td>' +
            '</tr>');
    }
}

/**
 * populate editProductForm with data of row clicked
 * @param event
 */
function populateEditProductForm(event) {
    const row = $(event.relatedTarget);
    $('#editProductIdHiddenInput').val(row.find('.productTableRowId').html());
    $('#editProductSerialNumberTextInput').val(row.find('.productTableRowSerialNumber').html());
    $('#editProductTypeTextInput').val(row.find('.productTableRowType').html());
    $('#editProductNameTextInput').val(row.find('.productTableRowName').html());
    $('#editProductMinimumOrderQuantityTextInput').val(row.find('.productTableRowMinimumOrderQuantity').html());
}

/**
 * update product when editProductForm is submitted
 */
function updateProduct() {
    // cancel submit if the form is invalid.
    if (!document.getElementById('editProductForm').checkValidity()) {
        console.log('One of the inputs in edit product form is invalid.');
        return;
    }
    // abort any pending request
    if (updateProductRequest) {
        updateProductRequest.abort();
    }
    // select and cache all the fields
    const $inputs = $('#editProductForm').find("input, select, button, textarea");
    // disable the inputs for the duration of the ajax request
    $inputs.prop('disabled', true);
    // serialize the data of the form in JSON
    const formJsonData = JSON.stringify(getEditProductFormData());
    // fire off the request
    updateProductRequest = $.ajax({
        url: backendBaseUrl + "/product",
        type: "put",
        contentType: "application/json",
        dataType: 'json',
        // async: false,
        data: formJsonData
    });
    // callback handler that will be called on success
    updateProductRequest.done(function () {
        console.log("Product updated.");
        renderProductTable();
    });
    // callback handler that will be called on failure
    updateProductRequest.fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error occurred during product modification: " + textStatus, errorThrown);
    })
    // callback handler that will be called regardless the request succeeded or not
    updateProductRequest.always(function () {
        $inputs.prop("disabled", false);
    });
}

/**
 * get values from inputs of editProductForm form
 * @returns {{serialNumber: (*|string|jQuery), minimumOrderQuantity: string, name: (*|string|jQuery), id: (*|string|jQuery), type: (*|string|jQuery)}}
 */
function getEditProductFormData() {
    return {
        id: $("#editProductIdHiddenInput").val(),
        serialNumber: $("#editProductSerialNumberTextInput").val(),
        type: $("#editProductTypeTextInput").val(),
        name: $("#editProductNameTextInput").val(),
        minimumOrderQuantity: parseFloat($("#editProductMinimumOrderQuantityTextInput").val()).toFixed(3)
    }
}

/**
 * delete product when deleteProductButton button is clicked
 */
function deleteProduct() {
    // cancel request if id is not specified
    const deleteProductButton = $('#deleteProductButton');
    const attr = deleteProductButton.attr('data-id');
    if (typeof attr === 'undefined' || attr === false || attr === '') {
        console.log('Could not delete product without id.');
        return;
    }
    // abort any pending request
    if (deleteProductRequest) {
        deleteProductRequest.abort();
    }
    // select and cache all the fields
    const $inputs = $('#createProductForm').find("input, select, button, textarea");
    // disable the inputs for the duration of the ajax request
    $inputs.prop('disabled', true);
    // serialize the data of the form in JSON
    const id = deleteProductButton.attr('data-id');
    // fire off the request
    deleteProductRequest = $.ajax({
        url: backendBaseUrl + "/product/" + id,
        type: "delete",
    });
    // callback handler that will be called on success
    deleteProductRequest.done(function () {
        console.log("Product deleted.");
        renderProductTable();
    });
    // callback handler that will be called on failure
    deleteProductRequest.fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error occurred during product deletion: " + textStatus, errorThrown);
    })
    // callback handler that will be called regardless the request succeeded or not
    deleteProductRequest.always(function () {
        $inputs.prop("disabled", false);
    });
}
