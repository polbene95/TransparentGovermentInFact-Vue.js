var house = new Vue({

    el: "#house",
    data: {
        url: "https://nytimes-ubiqum.herokuapp.com/congress/113/house",
        members: [],
        states: [],
        allMembers: [],
        canShowAdvice: false,
        hideUntilLoad: false,
        mainTable: [],
    },
    created: function () {
        this.getData();
    },
    methods: {
        getData: function () {


            /////Jquery/////

            //            $.getJSON(this.url, function (data) {
            //                house.members = data.results[0].members;
            //                house.allMembers = house.members;
            //                house.statesArray();
            //                house.canShowAdvice = true;
            //            });

            /////Javascript vanilla/////
            // Uncomment xhr.setRequestHeader part for adding a Header

            //            function loadJSON(path, success, error) {
            //                var xhr = new XMLHttpRequest();
            //                xhr.onreadystatechange = function () {
            //                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            //                        success(JSON.parse(xhr.responseText));
            //                    } else {
            //                        error(xhr);
            //                    }
            //                };
            //                xhr.open("GET", path, true);
            //                //xhr.setRequestHeader("API-Key", "your api key");
            //                xhr.send();
            //            }
            //            loadJSON(this.url,
            //                function (data) {
            //                    console.log(data);
            //                    house.members = data.results[0].members;
            //                    house.allMembers = house.members;
            //                    house.statesArray();
            //                    house.canShowAdvice = true;
            //                },
            //                function (xhr) {
            //                    console.error(xhr);
            //                }
            //            );

            fetch(this.url)
                .then(function (response) {
                    if (response.ok)
                        return response.json();
                })
                .then(function (data) {
                    house.members = data.results[0].members;
                    house.allMembers = house.members;
                    house.statesArray();
                    house.hideUntilLoad = true;
                    house.canShowAdvice = true;
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
