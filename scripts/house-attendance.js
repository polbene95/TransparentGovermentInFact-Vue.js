var houseAttendance = new Vue({
    el: "#house-attendance",
    data: {
        url: "https://nytimes-ubiqum.herokuapp.com/congress/113/house",
        members: [],
        allMembers: [],
        canShowAdvice: false,
        lowests: [],
        highests: [],
        statistics: {}
    },
    created: function () {
        this.getData();
    },
    methods: {
        getData: function () {
            $.getJSON(this.url, function (data) {
                houseAttendance.members = data.results[0].members;
                houseAttendance.allMembers = houseAttendance.members;
                houseAttendance.canShowAdvice = true;
                houseAttendance.mainInfo();
                houseAttendance.leastEngaged();
                houseAttendance.mostEngaged();
            });
        },
        mainInfo: function () {
            this.members = this.allMembers;

            var demNum = 0;
            var repNum = 0
            var indNum = 0;
            var ttlNum = 0;
            var demPct = 0;
            var repPct = 0;
            var indPct = 0;
            var ttlPct = 0;

            $(this.members).map(function () {
                if (this.party == "D") {
                    demNum++;
                    demPct += Number(this.votes_with_party_pct);
                }
                if (this.party == "R") {
                    repNum++;
                    repPct += Number(this.votes_with_party_pct);
                }
                if (this.party == "I") {
                    indNum++;
                    indPct += Number(this.votes_with_party_pct);
                }
                ttlNum++;
                ttlPct += Number(this.votes_with_party_pct);
            });
            demPct = (demPct / demNum).toFixed(2);
            repPct = (repPct / repNum).toFixed(2);
            indPct = (indPct / indNum).toFixed(2);
            ttlPct = (ttlPct / ttlNum).toFixed(2);

            return this.statistics = {

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
        leastEngaged: function () {
            var membersArray = [];
            var membersSorted = this.members.sort(function (a, b) {
                return parseFloat(a.missed_votes) > parseFloat(b.missed_votes) ? 1 : parseFloat(a.missed_votes) < parseFloat(b.missed_votes) ? -1 : 0;
            });


            for (var i = 0; i < membersSorted.length; i++) {
                if (i >= membersSorted.length * 0.1) {
                    if (membersSorted[i].missed_votes == membersSorted[i - 1].missed_votes) {
                        membersArray.push(membersSorted[i]);
                    } else {
                        break;
                    }
                } else {
                    membersArray.push(membersSorted[i]);
                }
            }
            this.lowests = membersArray;
        },
        mostEngaged: function () {
            var membersArray = [];
            var membersSorted = this.members.sort(function (a, b) {
                return parseFloat(a.missed_votes) < parseFloat(b.missed_votes) ? 1 : parseFloat(a.missed_votes) > parseFloat(b.missed_votes) ? -1 : 0;
            });
            for (var i = 0; i < membersSorted.length; i++) {
                if (i >= membersSorted.length * 0.1) {
                    if (membersSorted[i].missed_votes == membersSorted[i - 1].missed_votes) {
                        membersArray.push(membersSorted[i]);
                    } else {
                        break;
                    }
                } else {
                    membersArray.push(membersSorted[i]);
                }
            }
            this.highests = membersArray;
        }
    }
});

