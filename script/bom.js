let getProductBomEntriesRequest;
let updateProductBomEntryRequest;

/**
 * initialization
 */
(function () {
    'use strict'

    const productId = getProductIdFromQueryString();

    // Render initial table
    renderProductBomEntriesTable(productId);

    // Register shown.bs.modal event of editProductBomEntryModal
    $('#editProductBomEntryModal').on('shown.bs.modal', populateEditProductBomEntryModal);

    // Register submit event of editProductForm
    $('#editProductBomEntryForm').on('submit', updateProductBomEntry);
})()

/**
 * get product id from query string of the bom.html page url
 * @returns {string}
 */
function getProductIdFromQueryString() {
    return (new URL(document.location)).searchParams.get("productId");
}

/**
 * render product material entry count table
 */
function renderProductBomEntriesTable(productId) {
    // abort any pending request
    if (getProductBomEntriesRequest) {
        getProductBomEntriesRequest.abort();
    }
    // fire off the request
    getProductBomEntriesRequest = $.ajax({
        url: backendBaseUrl + "/product/" + productId + "/bom/entries",
        type: "get",
        // async: false
    });
    // callback handler that will be called on success
    getProductBomEntriesRequest.done(function (response) {
        $('#productTableBody tr').remove();
        renderProductBomEntriesTableBody(response.entries);
    });
    // callback handler that will be called on failure
    getProductBomEntriesRequest.fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error occurred during get product " + productId + " bom entries: " + textStatus, errorThrown);
    })
    // callback handler that will be called regardless the request succeeded or not
    getProductBomEntriesRequest.always(function () {

    });
}

/**
 * render product bom entries table body
 * @param entries
 */
function renderProductBomEntriesTableBody(entries) {
    const tbody = $('#productBomEntryCountTableBody');
    for (const entry of entries) {
        tbody.append('<tr data-bs-toggle="modal" data-bs-target="#editProductBomEntryModal">' +
            '<td class="productBomEntriesTableRowId">' + entry.id + '</td>' +
            '<td class="productBomEntriesTableRowProductId" hidden>' + entry.productId + '</td>' +
            '<td class="productBomEntriesTableRowMaterialId" hidden>' + entry.materialId + '</td>' +
            '<td class="productBomEntriesTableRowMaterialSerialNumber">' + entry.materialSerialNumber + '</td>' +
            '<td class="productBomEntriesTableRowMaterialName">' + entry.materialName + '</td>' +
            '<td class="productBomEntriesTableRowMaterialUsage">' + entry.materialUsage + '</td>' +
            '</tr>');
    }
}

/**
 * populate editProductBomEntryModal with data of row clicked
 * @param event
 */
function populateEditProductBomEntryModal(event) {
    const row = $(event.relatedTarget);
    $('#editProductBomEntryIdHiddenInput').val(row.find('.productBomEntriesTableRowId').html());
    $('#editProductBomEntryProductIdHiddenInput').val(row.find('.productBomEntriesTableRowProductId').html());
    $('#editProductBomEntryMaterialIdHiddenInput').val(row.find('.productBomEntriesTableRowMaterialId').html());
    $('#editProductBomEntryMaterialSerialNumberTextInput').val(row.find('.productBomEntriesTableRowMaterialSerialNumber').html());
    $('#editProductBomEntryMaterialNameTextInput').val(row.find('.productBomEntriesTableRowMaterialName').html());
    $('#editProductBomEntryMaterialUsageTextInput').val(row.find('.productBomEntriesTableRowMaterialUsage').html());
}

function updateProductBomEntry() {
    // cancel submit if the form is invalid.
    if (!document.getElementById('editProductBomEntryForm').checkValidity()) {
        console.log('One of the inputs in edit product form is invalid.');
        return;
    }
    // abort any pending request
    if (updateProductBomEntryRequest) {
        updateProductBomEntryRequest.abort();
    }
    const productId = $('#editProductBomEntryProductIdHiddenInput').val();
    const entryId = $('#editProductBomEntryIdHiddenInput').val();
    // select and cache all the fields
    const $inputs = $('#editProductBomEntryForm').find("input, select, button, textarea");
    // disable the inputs for the duration of the ajax request
    $inputs.prop('disabled', true);
    // serialize the data of the form in JSON
    const formJsonData = JSON.stringify(getEditProductBomEntryFormData());
    // fire off the request
    updateProductBomEntryRequest = $.ajax({
        url: backendBaseUrl + "/product/" + productId + "/bom/entry/" + entryId,
        type: "put",
        contentType: "application/json",
        dataType: 'json',
        // async: false,
        data: formJsonData
    });
    // callback handler that will be called on success
    updateProductBomEntryRequest.done(function () {
        console.log("Product updated.");
        renderProductTable();
    });
    // callback handler that will be called on failure
    updateProductBomEntryRequest.fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error occurred during product " + productId + " bom entry " + entryId + " modification: " + textStatus, errorThrown);
    })
    // callback handler that will be called regardless the request succeeded or not
    updateProductBomEntryRequest.always(function () {
        $inputs.prop("disabled", false);
    });
}

function getEditProductBomEntryFormData() {
    return {
        materialId: $("#editProductBomEntryMaterialIdHiddenInput").val(),
        materialSerialNumber: $("#editProductBomEntryMaterialSerialNumberTextInput").val(),
        materialUsage: $("#editProductBomEntryMaterialUsageTextInput").val()
    }
}
