init();

$(function () {
    document.addEventListener("pku_elective_event", function (event) {
        console.log("got event:" + event.detail.message);
        if (event.detail.message === "hide") {
            console.log("hiding: " + event.detail.seq_no);
            hide_course(event.detail.seq_no)
        }
        else if (event.detail.message === "show") {
            console.log("showing:" + event.detail.name);
            show_course(event.detail.name)
        }
    });

    function add_to_tr(collection) {
        var course_tr_list = $("table.datagrid:eq(0) tr.datagrid-even,table.datagrid:eq(0) tr.datagrid-odd").toArray();
        console.log("adding to list");
        var course_list=$("table.datagrid:eq(0) tbody");
        course_list.append(collection);
        course_tr_list=course_tr_list.concat(collection.toArray());
        refresh_course(course_tr_list);
        $("tr.datagrid-footer,tr[align=right]").remove();
        insert_hide_button();
        hide_courses();
    }

    if(location.toString().indexOf("Work")!==-1) {
        var url = "https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/electiveWork/election.jsp?netui_pagesize=electableCourseListGrid%3B20&netui_row=electableCourseListGrid%3B";
        LoadCourses(20,true,url,add_to_tr);
        $.ajax({
            url: chrome.extension.getURL("html/extended/ui.html"),
            success: function (data) {
                $("body").append($(data));
            }
        })
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
    for(var i=0; i<course_list.length; i++){
        var view=$(course_list[i]);
        var view_url=view.find("td:eq(0) a").attr("href");
        var _seq_no=view_url.split("course_seq_no=")[1];
        var click_link=$("<a href='#' onclick='\n" +
            "                    event.preventDefault();\n" +
            "\n" +
            "                    setTimeout(document.dispatchEvent(new CustomEvent(\"pku_elective_event\",{" +
            "detail:{" +
            "message:\"hide\"," +
            "seq_no:\"" + _seq_no +
            "\"}" +
            "})),0)\n" +
            "                '/>");
        click_link.text("点击隐藏");
        var click_td=$("<td class='datagrid' align='center'/>");
        click_td.append(click_link);
        $("table.datagrid:eq(0) tr[class!=datagrid-header]:eq("+i+")").append(click_td);
    }
}