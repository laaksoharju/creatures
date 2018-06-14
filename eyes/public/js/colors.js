/* Get the text of the clicked link, and convert it to lowercase so it can be used to
change the background of the div box */
$('a').click(function () {
    // For displaying the clicked link
    // alert("Clicked link: " + $(this).text());
    var color = $(this).text().toLowerCase();
    $("div").css("background-color", color);    
});