
var course=function (seq_no, name,type,tr) {
    this.seq_no=seq_no;
    this.name=name;
    this.type=type;//1-预选 0-选课计划
    this.tr=tr;
};

    var hidden_courses=localStorage["hidden"];
    /**
     *
     * @type {jQuery|Array}
     */
    var courses;
    courses = localStorage["all"];
