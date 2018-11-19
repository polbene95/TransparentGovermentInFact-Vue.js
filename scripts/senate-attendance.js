var senateAttendance = new Vue({
    el: "#senate-attendance",
    data: {
        url: "https://nytimes-ubiqum.herokuapp.com/congress/113/senate",
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
                senateAttendance.members = data.results[0].members;
                senateAttendance.allMembers = senateAttendance.members;
                senateAttendance.canShowAdvice = true;
                senateAttendance.mainInfo();
                senateAttendance.leastEngaged();
                senateAttendance.mostEngaged();
            });
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
            var membersArray = [];
            var membersSorted = this.members.sort((a, b) => {
                parseFloat(a.sortKey) > parseFloat(b.sortKey) ? 1 : parseFloat(a.sortKey) < parseFloat(b.sortKey) ? -1 : 0;
            });


            for (var i = 0; i < membersSorted.length; i++) {
                if (i >= membersSorted.length * 0.1) {
                    if (membersSorted[i].sortKey == membersSorted[i - 1].sortKey) {
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
        mostEngaged: function (sortKey) {
            var membersArray = [];
            var membersSorted = this.members.sort(function (a, b) {
                return parseFloat(a.sortKey) < parseFloat(b.sortKey) ? 1 : parseFloat(a.sortKey) > parseFloat(b.sortKey) ? -1 : 0;
            });
            for (var i = 0; i < membersSorted.length; i++) {
                if (i >= membersSorted.length * 0.1) {
                    if (membersSorted[i].sortKey == membersSorted[i - 1].sortKey) {
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
