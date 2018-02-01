$(function () {


    function add_to_tr(collection) {
        var course_tr_list = $("table.datagrid:eq(0) tr.datagrid-even,table.datagrid:eq(0) tr.datagrid-odd").toArray();
        console.log("adding to list");
        var course_list=$("table.datagrid:eq(0) tbody");
        course_list.append(collection);
        course_tr_list=course_tr_list.concat(collection.toArray());
        refresh_course(course_tr_list);
        $("tr.datagrid-footer,tr[align=right]").remove();
        insert_hide_button();
        $.ajax({
            url:chrome.extension.getURL("js/extended/common.js"),
            success:function (data) {
                var container=$("<script/>");
                container.text(data);
                $("body").append(container);
            }
        });
        hide_courses();
    }
    if(location.toString().indexOf("Work")!==-1) {
        var url = "http://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/electiveWork/election.jsp?netui_pagesize=electableCourseListGrid%3B20&netui_row=electableCourseListGrid%3B";
        LoadCourses(20,true,url,add_to_tr);
    }
    else {
        insert_hide_button();
    }
});

function insert_hide_button() {
    var header=$("<th/>",{
        "class":"datagrid"
    }).text("隐藏");
    $("tr.datagrid-header:eq(0)").append(header);
    $("table.datagrid:eq(0) th").removeAttr("style");
    var course_list = $("table.datagrid:eq(0) tr.datagrid-even,table.datagrid:eq(0) tr.datagrid-odd").toArray();
    console.log("In insert button,number: "+course_list.length);
    for(var i=0;i<course_list.length;i++){
        var view=$(course_list[i]);
        var view_url=view.find("td:eq(0) a").attr("href");
        var _seq_no=view_url.split("course_seq_no=")[1];
        var click_link=$("<a href='#' onclick='\n" +
            "                    event.preventDefault();\n" +
            "\n" +
            "                    hide_course(\""+_seq_no+"\");\n" +
            "                '/>");
        click_link.text("点击隐藏");
        var click_td=$("<td class='datagrid' align='center'/>");
        click_td.append(click_link);
        $("table.datagrid:eq(0) tr[class!=datagrid-header]:eq("+i+")").append(click_td);
    }
}