$(function () {
    var course_tr_list = $("table.datagrid:eq(0) tr.datagrid-even:gt(0),table.datagrid:eq(0) tr.datagrid-odd:gt(0)");
    function add_to_tr(collection) {
        course_tr_list.concat(collection);
        $("table.datagrid:eq(0) tbody").append(collection);
    }
    if(location.toString().indexOf("Plan")!==-1) {
        var url = "http://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/electiveWork/election.jsp?netui_pagesize=electableCourseListGrid%3B20&netui_row=electableCourseListGrid%3B";
        LoadCourses(20,true,url,add_to_tr);
    }
    refresh_course(course_tr_list);
    $("tr.datagrid-footer,tr[align=right]").remove();
    for(var _tr in course_tr_list){
        var seq_no=_tr.find();
    }
});