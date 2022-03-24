let getProductBomEntryCountRequest;
let getProductBomRequest;

/**
 * initialization
 */
(function () {
    'use strict'

    // Render initial table
    renderProductBomEntryCountTable();

    // Register shown.bs.modal event of editProductBomEntryModal
    $('#editProductBomModal').on('shown.bs.modal', populateEditProductBomTable);

})()

/**
 * render product material entry count table
 */
function renderProductBomEntryCountTable() {
    // abort any pending request
    if (getProductBomEntryCountRequest) {
        getProductBomEntryCountRequest.abort();
    }
    // fire off the request
    getProductBomEntryCountRequest = $.ajax({
        url: backendBaseUrl + "/products/bom/entryCount",
        type: "get",
        // async: false
    });
    // callback handler that will be called on success
    getProductBomEntryCountRequest.done(function (response) {
        $('#productTableBody tr').remove();
        renderProductBomEntryCountTableBody(response.entryCounts);
    });
    // callback handler that will be called on failure
    getProductBomEntryCountRequest.fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error occurred during get all products' bom entry count: " + textStatus, errorThrown);
    })
    // callback handler that will be called regardless the request succeeded or not
    getProductBomEntryCountRequest.always(function () {

    });
}

/**
 * render product material entry count table body
 * @param entryCounts
 */
function renderProductBomEntryCountTableBody(entryCounts) {
    const tbody = $('#productBomEntryCountTableBody');
    for (const entryCount of entryCounts) {
        tbody.append('<tr data-bs-toggle="modal" data-bs-target="#editProductBomModal">' +
            '<td class="productBomEntryCountTableRowId">' + entryCount.id + '</td>' +
            '<td class="productBomEntryCountTableRowSerialNumber">' + entryCount.serialNumber + '</td>' +
            '<td class="productBomEntryCountTableRowType">' + entryCount.type + '</td>' +
            '<td class="productBomEntryCountTableRowName">' + entryCount.name + '</td>' +
            '<td class="productBomEntryCountTableRowBomEntryCount">' + entryCount.entryCount + '</td>' +
            '</tr>');
    }
}

/**
 * populate editProductBomTable with data of row clicked
 * @param event
 */
function populateEditProductBomTable(event) {
    const row = $(event.relatedTarget);
    renderProductBomTable(row.find('.productBomEntryCountTableRowId').html());
}

function renderProductBomTable(productId) {
    // abort any pending request
    if (getProductBomRequest) {
        getProductBomRequest.abort();
    }
    // fire off the request
    getProductBomRequest = $.ajax({
        url: backendBaseUrl + "/product/" + productId + "/bom/entries",
        type: "get",
        // async: false
    });
    // callback handler that will be called on success
    getProductBomRequest.done(function (response) {
        $('#productTableBody tr').remove();
        renderProductBomTableBody(response.entries);
    });
    // callback handler that will be called on failure
    getProductBomRequest.fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error occurred during get all products' bom entry count: " + textStatus, errorThrown);
    })
    // callback handler that will be called regardless the request succeeded or not
    getProductBomRequest.always(function () {

    });
}

/**
 * render product bom table body
 * @param entries
 */
function renderProductBomTableBody(entries) {
    const tbody = $('#productBomTableBody');
    for (const entry of entries) {
        tbody.append('<tr data-bs-toggle="modal" data-bs-target="#editProductBomEntryModal">' +
            '<td class="productBomTableRowId">' + entry.id + '</td>' +
            '<td class="productBomTableRowProductId" hidden>' + entry.productId + '</td>' +
            '<td class="productBomTableRowMaterialId" hidden>' + entry.materialId + '</td>' +
            '<td class="productBomTableRowSerialNumber">' + entry.materialSerialNumber + '</td>' +
            '<td class="productBomTableRowName">' + entry.materialName + '</td>' +
            '<td class="productBomTableRowUsage">' + entry.materialUsage + '</td>' +
            '</tr>');
    }
}
