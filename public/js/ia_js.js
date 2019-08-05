$(document).ready(function () {
    $("#addItem").on("click", function () {
        $("#addForm").css("display", "block");
    });

    $("#closeBtnAdd").on("click", function () {
        $("#addForm").css("display", "none");
    });

    $("#updateItem").on("click", function () {
        $("#updateForm").css("display", "block");
    });

    $("#closeBtnUp").on("click", function () {
        $("#updateForm").css("display", "none");
    });

    $("#removeItem").on("click", function () {
        $("#deleteForm").css("display", "block");
    });

    $("#closeBtnDel").on("click", function () {
        $("#deleteForm").css("display", "none");
    });


});
