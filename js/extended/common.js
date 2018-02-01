
function LoadCourses(fromid, retry,url, callback) {
    var collection = null;

    // 获得从id开始的下20个课程
    function GetNext(id, retry) {
        $.get(url + id, function (html) {
            if (!html)
                if (retry)
                    return setTimeout(GetNext, 500, fromid, retry);
                else
                    return callback(false);

            var newPageContent = $(html).find("table.datagrid:eq(0) tr:gt(0)");

            if (!collection)
                collection = newPageContent.filter(":lt(" + (newPageContent.length - 2) + ")");
            else
                collection = collection.add(newPageContent.filter(":lt(" + (newPageContent.length - 2) + ")"));
            if (newPageContent.length - 2 === 20)
                GetNext(id + 20);
            else
                callback(collection);
        }).fail(function () {
            if (retry)
                return setTimeout(GetNext, 500, fromid, retry);
            else
                return callback(false);
        });
    }

    GetNext(fromid, retry);
}


/**
 *
 * @param {string} key
 * @returns {course|boolean}
 */
function find_course(key){
    for (var course in courses){
        if(course.seq_no===key)
            return course;
        else if(course.name===key)
            return course;
    }
    return false;
}

/**
 *
 * @param {string} id
 */
function hide_course(id) {
    hidden_courses+=find_course(id);
}

/***
 *
 * @param {string} id
 * @returns {boolean}
 */
function check_if_hidden(id) {
    return ($.inArray(find_course(id),hidden_courses,0))!==-1;
}

/**
 *
 * @param {jQuery} course_list
 */
function refresh_course(course_list) {

    courses=[];
    for(var _course in course_list){
        var course=parse_course(_course);
        courses.push(course);
    }
    for(_course in hidden_courses){
        if(!$.inArray(_course,courses)){
            courses.splice(courses.indexOf(_course),1)
        }
    }
}
/**
 * Parse a course from $tr element
 * @param {jQuery|string} _tr then $tr element
 * @return course
 */
function parse_course(_tr) {
    if(location.toString().indexOf("electiveWork")!==-1) {
        var tr=$(_tr);
        tr.removeClass();
        var name = tr.find("td:eq(0) a").text();
        var view_url = tr.find("td:eq(0) a").attr("href");
        var seq_no = view_url.split("course_seq_no=")[1];
        var lecturer=tr.find("td:eq(4) span").text();
        var elect=tr.find("td:eq(9) span").text();
        var current_elect_num=parseInt(elect.split(" / ")[0]);
        var max_elect_num=parseInt(elect.split(" / ")[1]);
        var course=new course(seq_no,name,1,tr);
        course.current_elect_num=current_elect_num;
        course.max_elect_num=max_elect_num;
        course.lecturer=lecturer;
        return course;
    }
    else {
        tr=$(_tr);
        tr.removeClass();
        name = tr.find("td:eq(0) a").text();
        view_url = tr.find("td:eq(0) a").attr("href");
        seq_no = view_url.split("course_seq_no=")[1];
        course=new course(seq_no,name,0,tr);
        return course;
    }
}