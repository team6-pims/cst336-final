$(document).ready(function () {
    /* Navbar listeners */
    $("#database").on("click", function () {
        $("#reports").attr("class", "");
        $("#about").attr("class", "");
        $("#database").attr("class", "navBarActive");
        $("#itemTable").show();
        $("#reportsPage").hide();
        $("#aboutDescription").hide();
    });

    $("#reports").on("click", function () {
        $("#reports").attr("class", "navBarActive");
        $("#about").attr("class", "");
        $("#database").attr("class", "");
        $("#itemTable").hide();
        $("#reportsPage").show();
        $("#aboutDescription").hide();
    });

    $("#about").on("click", function () {
        $("#reports").attr("class", "");
        $("#about").attr("class", "navBarActive");
        $("#database").attr("class", "");
        $("#itemTable").hide();
        $("#reportsPage").hide();
        $("#aboutDescription").show();
    });
    
    /* Database manipulation listeners */
    $("#addItem").on("click", function () {
        $("#addForm").css("display", "block");
    });

    $("#closeBtnAdd").on("click", function () {
        $("#addForm").css("display", "none");
        $("#addErrorMessage").hide();
    });

    $("#updateItem").on("click", function () {
        $("#updateForm").css("display", "block");
    });

    $("#closeBtnUp").on("click", function () {
        $("#updateForm").css("display", "none");
        $("#upErrorMessage").hide();
    });

    $("#removeItem").on("click", function () {
        $("#deleteForm").css("display", "block");
    });

    $("#closeBtnDel").on("click", function () {
        $("#deleteForm").css("display", "none");
        $("#delErrorMessage").hide();
    });

    //ajax call to auto populate an item via ID on update page
    $("#updateID").on("change", function () {
        $.ajax({
             method: "get",
                url: "/adminPage",
               data: {"itemID": $("#updateID").val(),
                      "action": "requestItem"},
            success: function (results, status) {
                 results.forEach(function (row) {
                     $("#updateName").val(row.itemName);
                     $("#updatePrice").val(row.price);
                     $("#updateDesc").val(row.description1);
                     $("#updateTags").val(row.description2);
                 });
            }
        });
    });

    // add submission
    $("#submitAdd").on("click", function () {
        var name = $("#addName").val();
        var price = $("#addPrice").val();
        var description = $("#addDesc").val();
        var tag = $("#addTag").val();

        if (name == "" || price == ""|| description == "" || tag == "") {
            $("#addErrorMessage").show();
            $("#addErrorMessage").css({"textAlign": "center", "color": "red"})
        } else {
            $.ajax({
                method: "post",
                url: "/adminPage",
                data: {
                    "itemName": name,
                    "price": price,
                    "description": description,
                    "tags": tag,
                    "submitType": $("#submitAdd").val()
                },
                success: function (status) {
                    $("#actionMessage").show();
                    $("#actionMessage").text("Addition Sucessful!");
                    $("#actionMessage").css("color", "green");
                    $("#actionMessage").fadeOut(5000); // five second fade out
                    $("#addForm").css("display", "none");
                    $("#addFormRes").trigger("reset");
                    $("#addErrorMessage").hide();
                    redrawTable()
                }
            });
        }
    });

    // update submission
    $("#submitUpdate").on("click", function () {
        var itemID = $("#updateID").val();
        var name = $("#updateName").val();
        var price = $("#updatePrice").val();
        var description = $("#updateDesc").val();
        var tags = $("#updateTags").val();

        if (itemID = "" || name == "" || price == ""|| description == "" || tag == "") {
            $("#upErrorMessage").show();
            $("#upErrorMessage").css({"textAlign": "center", "color": "red"})
        } else {
            $.ajax({
                method: "post",
                url: "/adminPage",
                data: {
                    "itemID": itemID,
                    "itemName": name,
                    "price": price,
                    "description": description,
                    "tags": tags,
                    "submitType": "update"
                },
                success: function (status) {
                    $("#actionMessage").show();
                    $("#actionMessage").text("Update Sucessful!");
                    $("#actionMessage").css("color", "green");
                    $("#actionMessage").fadeOut(5000); // five second fade out
                    $("#updateForm").css("display", "none");
                    $("#upFormRes").trigger("reset");
                    $("#upErrorMessage").hide();
                    redrawTable()
                }
            });
        }
    });

    // delete submission
    $("#submitDel").on("click", function () {
        var itemID = $("#deleteID").val();

        if (itemID = "" || name == "" || price == ""|| description == "" || tag == "") {
            $("#delErrorMessage").show();
            $("#delErrorMessage").css({"textAlign": "center", "color": "red"})
        } else {
            $.ajax({
                method: "post",
                url: "/adminPage",
                data: {
                    "itemID": itemID,
                    "submitType": "delete"
                },
                success: function (status) {
                    $("#actionMessage").show();
                    $("#actionMessage").text("Deletion Sucessful!");
                    $("#actionMessage").css("color", "green");
                    $("#actionMessage").fadeOut(5000); // five second fade out
                    $("#deleteForm").css("display", "none");
                    $("#delFormRes").trigger("reset");
                    $("#delErrorMessage").hide();
                    redrawTable()
                }
            });
        }
    });

    /* Reports listeners */
    $("#query").on("change", function () {
        $("#querySpecifier").show();
        if ($("#query").val() == 'popular') {
            $("#querySpecifier").html("<option value='most'> Most </option>" +
                                    "<option value='least'> Least </option>")
        } else if ($("#query").val() == 'price') {
            $("#querySpecifier").html("<option value='high'> Most Expensive </option>" +
                                    "<option value='low'> Least Expensive</option>")
        } else {
            $("#querySpecifier").hide();
        }
    });

    $("#reportsSubmit").on("click", function () {
        var query, specifier;

        if ($("#query").val() == '') {
            //error
        } else {
            query = $("#query").val();
            specifier = $("#querySpecifier").val();
            retrieveReport(query, specifier)
        }
    })
});

function redrawTable() {
    $.ajax({
        method: "get",
        url: "/adminPage",
        data: {"action": "redrawTable"},
        success: function (rows) {
            $(".tableData").empty();
            $(".tableData").html("<tr class=\"tableHeader\">\n" + "<th> Product ID </th>\n" +
                "<th> Product Name </th>\n" + "<th> Price ($) </th>\n" + "<th> Description </th>\n" +
                "<th> Tags </th>\n");
            rows.forEach(function (row) {
                $(".tableData").append("<tr class=\"rowData\"><td>" + row.itemID + "</td>\n<td>" + row.itemName +
                    "</td>\n<td>" + row.price + "</td>\n<td>" + row.description1 + "</td>\n<td>" + row.description2
                    + "</td></tr>");
            });
        }
    })
}

function retrieveReport(query, specifier) {
    $.ajax({
        method: "get",
        url: "/adminPage",
        data: {
            "action": "report",
            "query": query,
            "specifier": specifier
        },
        success: function (rows) {
            $("#reportsTable").empty();
            $("#reportsTable").html("<tr class=\"tableHeader\">\n" + "<th> Product ID </th>\n" +
                "<th> Prodcut Name </th>\n" + "<th> Price ($) </th>\n" + "<th> Description </th>\n" +
                "<th> Tags </th>\n");
            rows.forEach(function (row) {
                $("#reportsTable").append("<tr class=\"rowData\"><td>" + row.itemID + "</td>\n<td>" + row.itemName +
                    "</td>\n<td>" + row.price + "</td>\n<td>" + row.description1 + "</td>\n<td>" + row.description2
                    + "</td></tr>");
            });
        }
    })
}
