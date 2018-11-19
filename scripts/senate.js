const app = new Vue({

    el: "#app",
    data: {
        urlSenate: "https://nytimes-ubiqum.herokuapp.com/congress/113/senate",
        urlHouse: "https://nytimes-ubiqum.herokuapp.com/congress/113/house",
        members: [],
        states: [],
        allMembers: [],
        canShowAdvice: false,
        hideUntilLoad: false,
        mainTable: [],
        lowests: [],
        highests: [],
        statistics: {}
    },
    created: function () {
        if (location.pathname == "/senate-data.html") {
            this.getDataCongress(this.urlSenate);
        } else if (location.pathname == "/house-data.html") {
            this.getDataCongress(this.urlHouse);
        } else if (location.pathname == "/senate-attendance.html") {
            this.getDataAttendance(this.urlSenate)
        } else if (location.pathname == "/house-attendance.html") {
            this.getDataAttendance(this.urlHouse)
        } else if (location.pathname == "/senate-party-loyalty.html") {
            this.getDataLoyalty(this.urlSenate)
        } else {
            this.getDataLoyalty(this.urlHouse)
        }
    },
    methods: {
        getDataCongress: function (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    app.members = data.results[0].members;
                    app.allMembers = app.members;
                    app.statesArray();
                    app.hideUntilLoad = true;
                    app.canShowAdvice = true;
                })
        },
        getDataAttendance: function (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    app.members = data.results[0].members;
                    app.allMembers = app.members;
                    app.canShowAdvice = true;
                    app.mainInfo();
                    app.leastEngaged("missed_votes");
                    app.mostEngaged("missed_votes");
                })
        },
        getDataLoyalty: function (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    app.members = data.results[0].members;
                    app.allMembers = app.members;
                    app.canShowAdvice = true;
                    app.mainInfo();
                    app.leastEngaged("votes_with_party_pct");
                    app.mostEngaged("votes_with_party_pct");
                })
        },
        statesArray: function () {
            this.states = this.members
                .map(member => member.state)
                .filter(state => app.states.indexOf(state))
        },
        filter: function () {
            function getSelectedCheckboxes() {
                var selectedCheckboxes = [];
                document.querySelectorAll('input[name$=party]:checked')
                    .forEach(checkbox => selectedCheckboxes.push(checkbox.value))
                return selectedCheckboxes;
            }

            const checkboxes = getSelectedCheckboxes();
            const getSelectedState = document.getElementById("states");

            this.members = this.allMembers.filter(member =>
                checkboxes.includes(member.party) && (member.state == getSelectedState.value || getSelectedState.value == "all")
            )
        },
        mainInfo: function () {

            let demNum = 0;
            let repNum = 0
            let indNum = 0;
            let ttlNum = 0;
            let demPct = 0;
            let repPct = 0;
            let indPct = 0;
            let ttlPct = 0;

            this.allMembers.forEach(member => {
                if (member.party == "D") {
                    demNum++;
                    demPct += Number(member.votes_with_party_pct);
                }
                if (member.party == "R") {
                    repNum++;
                    repPct += Number(member.votes_with_party_pct);
                }
                if (member.party == "I") {
                    indNum++;
                    indPct += Number(member.votes_with_party_pct);
                }
                ttlNum++;
                ttlPct += Number(member.votes_with_party_pct);
            });

            demPct = (demPct / demNum).toFixed(2);
            repPct = (repPct / repNum).toFixed(2);
            indPct = (indPct / indNum).toFixed(2);
            ttlPct = (ttlPct / ttlNum).toFixed(2);

            this.statistics = {

                dem: {
                    party: "Democrat",
                    number: demNum,
                    votesPct: demPct,
                },
                rep: {
                    party: "Republicant",
                    number: repNum,
                    votesPct: repPct,
                },
                ind: {
                    party: "Independent",
                    number: indNum,
                    votesPct: indPct,
                },
                ttl: {
                    party: "Total",
                    number: ttlNum,
                    votesPct: ttlPct,
                },
            }
        },
        leastEngaged: function (sortKey) {
            let membersArray = [];
            let membersSorted = [...this.members].sort((a, b) => parseFloat(a[sortKey]) - parseFloat(b[sortKey]));
            this.fillTenPerCentArray(membersSorted, membersArray, sortKey);
            this.lowests = membersArray;
        },
        mostEngaged: function (sortKey) {
            var membersArray = [];
            let membersSorted = [...this.members].sort((a, b) => parseFloat(b[sortKey]) - parseFloat(a[sortKey]));
            this.fillTenPerCentArray(membersSorted, membersArray, sortKey);
            this.highests = membersArray;
        },
        fillTenPerCentArray: function (membersSorted, membersArray, sortKey) {
            for (var i = 0; i < membersSorted.length; i++) {
                if (i >= membersSorted.length * 0.1) {
                    if (membersSorted[i][sortKey] == membersSorted[i - 1][sortKey]) {
                        membersArray.push(membersSorted[i]);
                    } else {
                        break;
                    }
                } else {
                    membersArray.push(membersSorted[i]);
                }
            }
            return membersArray
        }
    }
});
