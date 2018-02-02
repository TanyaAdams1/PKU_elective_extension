var courses=[];
var hidden_courses=[];
var Initilized = false;

function MyCourse(seq_no, name, type, tr) {
    this.seq_no=seq_no;
    this.name=name;
    this.type=type;//1-预选 0-选课计划
    this.tr=tr;
}

function init() {
    chrome.storage.local.get({
        all: [],
        hidden: []
    }, function (items) {
        courses = items.all;
        hidden_courses = items.hidden;
        console.log("Got all:" + courses.toString());
        console.log("Got hidden:" + hidden_courses.toString());
        hide_courses();
    })
}

function update() {
    chrome.storage.local.set({
        all: courses,
        hidden: hidden_courses
    })
}

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
 * @returns {MyCourse|boolean}
 */
function find_course(key){
    for (var i=0;i<courses.length;i++){
        if(courses[i].seq_no===key)
            return courses[i];
        if(courses[i].name===key)
            return courses[i];
    }
    return false;
}

/**
 *
 * @param {string} id
 */
function hide_course(id){
    if (!find_course(id))
        return;
    console.log("hiding:" + find_course(id).name);
    if ($.inArray(find_course(id).name, hidden_courses) === -1)
        hidden_courses.push(find_course(id).name);
    update();
    hide_courses();
}

/**
 *
 * @param {$} course_list
 */
function refresh_course(course_list) {
    courses=[];
    for(var i=0;i<course_list.length;i++){
        var course=parse_course($(course_list[i]));
        courses.push(course);
    }
    chrome.storage.local.set({
        all: courses
    })
}
/**
 * Parse a MyCourse from $tr element
 * @param {jQuery|string} _tr then $tr element
 * @return MyCourse
 */
function parse_course(_tr) {
    try {
        if (location.toString().indexOf("electiveWork") !== -1) {
            var tr = $(_tr).clone();
            tr.removeClass();
            var name = tr.find("td:eq(0) a").text();
            var view_url = tr.find("td:eq(0) a").attr("href");
            var seq_no = view_url.split("course_seq_no=")[1];
            var lecturer = tr.find("td:eq(4) span").text();
            var elect = tr.find("td:eq(9) span").text();
            var current_elect_num = parseInt(elect.split(" / ")[0]);
            var max_elect_num = parseInt(elect.split(" / ")[1]);
            var course = new MyCourse(seq_no, name, 1, tr);
            course.current_elect_num = current_elect_num;
            course.max_elect_num = max_elect_num;
            course.lecturer = lecturer;
            return course;
        }
        else {
            tr = $(_tr).clone();
            tr.removeClass();
            name = tr.find("td:eq(0) a").text();
            view_url = tr.find("td:eq(0) a").attr("href");
            seq_no = view_url.split("course_seq_no=")[1];
            course = new Mycourse(seq_no, name, 0, tr);
            return course;
        }
    }catch (e){
        console.log("Exception in parsing MyCourse, "+e.toString());
    }
}

function hide_courses() {
    var courses_list = $("table.datagrid:eq(0) tr[class!=datagrid-header]").toArray();
    for (var course = 0; course < courses_list.length; course++) {
        var my_course_parsed=parse_course(courses_list[course]);
        if (my_course_parsed && $.inArray(my_course_parsed.name, hidden_courses) !== -1) {
            $(courses_list[course]).hide();
        }
        else
            $(courses_list[course]).show();
    }
    var insert_point = $("#course_insert_point");
    insert_point.find("a").remove();
    for (var i = 0; i < hidden_courses.length; i++) {
        insert_point.append(
            $("<a class='btn btn-dark btn-sm text-light m-2' onclick='document.dispatchEvent(" +
                "new CustomEvent(\"pku_elective_event\",{" +
                "detail:{" +
                "message:\"show\"," +
                "name:\"" + hidden_courses[i] + "\"" +
                "}" +
                "}))'>$text$</a>".replace(
                    /\$text\$/g, hidden_courses[i]
                ))
        )
    }
}

function show_course(name) {
    if ($.inArray(name, hidden_courses) !== -1) {
        hidden_courses.splice($.inArray(name, hidden_courses), 1);
        hide_courses();
    }
}