$(document).ready(function() {
    searchProducts("", "list", "");
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
                $("#products").append("      <div class='col-lg-4 col-md-6 mb-4'>        <div class='card h-100'>          <img class='card-img-top' src='img/"+json[i].itemID+".jpg' width=460 height=250>          <div class='card-body'>            <h4 class='card-title'>"+json[i].itemName+"</h4>            <hr>$"+json[i].price+"<hr><p class='card-text'>"+json[i].description1+"</p>          </div>          <div class='card-footer'>         <select id='quantity'>            <option value = '1'>1</option>            <option value = '2'>2</option>            <option value = '3'>3</option>            <option value = '4'>4</option>            <option value = '5'>5</option>        </select>      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       <button type='button' class='btn btn-primary' id="+json[i].itemID+">Add to Cart</button>          </div>        </div>      </div>")
            }
            console.log(json);
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

// AJAX Add item to cart
function cartAction(action, itemID, itemQuantity) {
    $.ajax({
        method: "get",
        url:    "/api/cartAction",
        data:   { action: action,
                  itemID: itemID,
                  itemQuantity: itemQuantity
        }
    });
}