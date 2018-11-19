//Done with none Jquery, but 

//House Vue

var app = new Vue({

    el: "#house",
    data: {
        url: "https://nytimes-ubiqum.herokuapp.com/congress/113/house",
        members: [],
        states: [],
        allMembers: [],
        canShowAdvice: false,
        mainTable: [],
    },
    created: function () {
        this.getData();
    },
    methods: {
        getData: function () {


            /////Jquery/////

            //$.getJSON(this.url, function (data) {
            //    app.members = data.results[0].members;
            //    app.allMembers = app.members;
            //    app.statesArray();
            //    app.canShowAdvice = true;
            //});

            /////Javascript vanilla/////
            // Uncomment xhr.setRequestHeader part for adding a Header

            function loadJSON(path, success, error) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        success(JSON.parse(xhr.responseText));
                    } else {
                        error(xhr);
                    }
                };
                xhr.open("GET", path, true);
                //xhr.setRequestHeader("API-Key", "your api key");
                xhr.send();
            }
            loadJSON(this.url,
                function (data) {
                    console.log(data);
                    app.members = data.results[0].members;
                    app.allMembers = app.members;
                    app.statesArray();
                    app.canShowAdvice = true;
                },
                function (xhr) {
                    console.error(xhr);
                }
            );

            fetch(this.url)
                .then(function (response) {
                    if (response.ok)
                        return response.json();
                })
                .then(function (data) {
                    app.members = data.results[0].members;
                    app.allMembers = app.members;
                    app.statesArray();
                    app.canShowAdvice = true;
                })
                

        },
        statesArray: function () {
            var allStates = $(this.members).map(function () {
                return this.state;
            });
            var sortedStates = allStates.sort();

            /////Jquery/////

            //this.states = Array.from(jQuery.unique(sortedStates));

            /////Javascript Vanilla/////

            for (var i = 0; i < sortedStates.length; i++) {
                if (this.states.indexOf(sortedStates[i]) == -1) {
                    this.states.push(sortedStates[i])
                }
            }
        },
        filter: function () {
            this.members = this.allMembers;

            //checking which checkboxes are checked
            /////Javascript vanilla/////

            function getSelectedCheckboxes() {
                var array = document.querySelectorAll('input[name$=party]:checked');
                var selectedCheckboxes = [];
                for (var i = 0; i < array.length; i++) {
                    selectedCheckboxes.push(array[i].value)
                }
                return selectedCheckboxes;
            }
            /////Jquery/////

            //var checkboxes = $("input[name=party]:checked").map(function() {
            //  return this.value;
            //}).get();

            /////Javascript Vanilla/////

            var checkboxes = getSelectedCheckboxes();
            var getSelectedState = document.getElementById("states");
            var resultMembers = this.members.filter(function (member) {
                var filter1 = checkboxes.includes(member.party);
                var filter2 = member.state == getSelectedState.value || getSelectedState.value == "all"
                return filter1 && filter2;
            })
            this.members = resultMembers;

            /////Jquery/////

            //var resultMembers = this.members.filter(function (member) {
            //      var filter1 = checkboxes.includes(member.party);
            //      var filter2 = member.state == $("#states").val() || $("#states").val() == "all";
            //      return filter1 && filter2;
            //  })
            //  this.members = resultMembers;
        },
    }
});



//House Attendance Vue

//var statApp = new Vue({
//    el: "#stt-app",
//    data: {
//        url: "https://nytimes-ubiqum.herokuapp.com/congress/113/house",
//        members: [],
//        allMembers: [],
//        canShowAdvice: false,
//        lowests: [],
//        highests: [],
//        statistics: {}
//    },
//    created: function () {
//        this.getData();
//    },
//    methods: {
//        getData: function () {
//            $.getJSON(this.url, function (data) {
//                statApp.members = data.results[0].members;
//                statApp.allMembers = statApp.members;
//                statApp.canShowAdvice = true;
//                statApp.mainInfo();
//                statApp.leastEngaged();
//                statApp.mostEngaged();
//            });
//        },
//        mainInfo: function () {
//            this.members = this.allMembers;
//
//            var demNum = 0;
//            var repNum = 0
//            var indNum = 0;
//            var ttlNum = 0;
//            var demPct = 0;
//            var repPct = 0;
//            var indPct = 0;
//            var ttlPct = 0;
//
//            $(this.members).map(function () {
//                if (this.party == "D") {
//                    demNum++;
//                    demPct += Number(this.votes_with_party_pct);
//                }
//                if (this.party == "R") {
//                    repNum++;
//                    repPct += Number(this.votes_with_party_pct);
//                }
//                if (this.party == "I") {
//                    indNum++;
//                    indPct += Number(this.votes_with_party_pct);
//                }
//                ttlNum++;
//                ttlPct += Number(this.votes_with_party_pct);
//            });
//            demPct = (demPct / demNum).toFixed(2);
//            repPct = (repPct / repNum).toFixed(2);
//            indPct = (indPct / indNum).toFixed(2);
//            ttlPct = (ttlPct / ttlNum).toFixed(2);
//
//            return this.statistics = {
//
//                dem: {
//                    party: "Democrat",
//                    number: demNum,
//                    votesPct: demPct,
//                },
//                rep: {
//                    party: "Republicant",
//                    number: repNum,
//                    votesPct: repPct,
//                },
//                ind: {
//                    party: "Independent",
//                    number: indNum,
//                    votesPct: indPct,
//                },
//                ttl: {
//                    party: "Total",
//                    number: ttlNum,
//                    votesPct: ttlPct,
//                },
//            }
//        },
//        leastEngaged: function () {
//            var membersArray = [];
//            var membersSorted = this.members.sort(function (a, b) {
//                return parseFloat(a.missed_votes) > parseFloat(b.missed_votes) ? 1 : parseFloat(a.missed_votes) < parseFloat(b.missed_votes) ? -1 : 0;
//            });
//
//
//            for (var i = 0; i < membersSorted.length; i++) {
//                if (i >= membersSorted.length * 0.1) {
//                    if (membersSorted[i].missed_votes == membersSorted[i - 1].missed_votes) {
//                        membersArray.push(membersSorted[i]);
//                    } else {
//                        break;
//                    }
//                } else {
//                    membersArray.push(membersSorted[i]);
//                }
//            }
//            //console.log(membersArray);
//            this.lowests = membersArray;
//        },
//        mostEngaged: function () {
//            var membersArray = [];
//            var membersSorted = this.members.sort(function (a, b) {
//                return parseFloat(a.missed_votes) < parseFloat(b.missed_votes) ? 1 : parseFloat(a.missed_votes) > parseFloat(b.missed_votes) ? -1 : 0;
//            });
//            for (var i = 0; i < membersSorted.length; i++) {
//                if (i >= membersSorted.length * 0.1) {
//                    if (membersSorted[i].missed_votes == membersSorted[i - 1].missed_votes) {
//                        membersArray.push(membersSorted[i]);
//                    } else {
//                        break;
//                    }
//                } else {
//                    membersArray.push(membersSorted[i]);
//                }
//            }
//            //console.log(membersArray);
//            this.highests = membersArray;
//        }
//    }
//});

