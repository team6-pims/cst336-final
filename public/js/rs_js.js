// Automatically get all search results on page load
$(document).ready(function() {
    path = location.pathname;

    if (path == "/search") {
        searchProducts("", "list", "");
    } else if (path == "/cart") {
        getSubTotal();
    }
    var url = window.location;
    $('ul.nav a[href="'+ url +'"]').parent().addClass('active');
    $('ul.nav a').filter(function() {
         return this.href == url;
    }).parent().addClass('active');
});

// Get query results
function searchProducts(querySearch, action, searchOptions) {
    $.ajax({
        method: "get",
        url: "/api/querySearch",
        data: { querySearch: querySearch,
                action: action,
                searchOptions: searchOptions
        },
        dataType: "json",
        // Add card to page
        success: function(json) {
            $("#products").html("");
            for (let i=0; i < json.length; i++) {
                $("#products").append("      <div class='col-lg-4 col-md-6 mb-4'>        <div class='card h-100'>          <img class='card-img-top' src='img/"+json[i].itemID+".jpg' width=460 height=250>          <div class='card-body'>            <h4 class='card-title'>"+json[i].itemName+"</h4>            <hr>$"+json[i].price.toLocaleString("en")+"<hr><p class='card-text'>"+json[i].description1+"</p>          </div>          <div class='card-footer'>         <select id='quantity'>            <option value = '1'>1</option>            <option value = '2'>2</option>            <option value = '3'>3</option>            <option value = '4'>4</option>            <option value = '5'>5</option>        </select>      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       <button type='button' class='btn btn-primary' id="+json[i].itemID+">Add to Cart</button>          </div>        </div>      </div>")
            }
            console.log(json);
        }
    });
}

// AJAX Cart functionality
function cartAction(action, itemID, itemQuantity) {
    $.ajax({
        method: "get",
        url:    "/api/cartAction",
        data:   { action: action,
                  itemID: itemID,
                  itemQuantity: itemQuantity
        },
        success: function(text) {
            $.toast({
                text: text,
                heading: "",
                icon: "success",
                showHideTransition: "fade",
                allowToastClose: true,
                hideAfter: 1500,
                stack: 3,
                position: "top-center"
            });
        }
    });
}

// Get cart subtotal
function getSubTotal() {
    $.ajax({
        method: "get",
        url:    "/api/getCartSubtotal",
        success: function(text) {
            $("#subtotal").html("");
            $("#subtotal").append("$" + text[0].subTotal.toLocaleString("en"));
        }
    });
}

// Add to cart button function
$("#products").on("click", function(e) {
    var className = $(e.target).prop('class');
    
    if (className == 'btn btn-primary') {
        var itemID = $(e.target).attr("id");
        var itemQuantity = $(e.target).prev().val();

        cartAction("add", itemID, itemQuantity);
    }
});

// Remove item from cart
$(".deleteItem").on("click", function(e) {
    var itemID = $(e.target).attr("itemID");
    //alert(itemID);
    cartAction("delete", itemID);
    location.reload(true);
});

// Update item quantity
$('.itemQuantity').on("input", function(e) {
    var itemID = $(e.target).attr("itemID");
    var itemQty = $(e.target).prop("value");

    cartAction("update", itemID, itemQty);
    getSubTotal();
});

// Search function
$("#querySearch").on("search", function() {
    var querySearch = $(this).val();
    var selected = [];
    $.each($("input[name='searchOptions']:checked"), function() {
        selected.push($(this).val());
    });
    searchProducts(querySearch, "", selected);
});