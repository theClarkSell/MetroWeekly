﻿(function () {
    "use strict";

    var articleList = new WinJS.Binding.List();

    
    WinJS.xhr({ url: "http://metro-weekly.com/article/getapproved" }).then(function (result) {
        var articles = JSON.parse(result.response);
        
        articles.forEach(function (i) {
            articleList.push(i); 
        })


        var groupCount = {};
        var maxItems = 6;

        var filteredList = articleList.createFiltered(function _filterItems(item) {
            groupCount[item.group] = groupCount[item.group] ? groupCount[item.group] + 1 : 1;
            return groupCount[item.group] <= maxItems;
        });

    });

    // Sorts the groups
    function compareGroups(leftKey, rightKey) {

        return rightKey - leftKey;
    }

    // Returns the group key that an item belongs to
    function getGroupKey(dataItem) {
        var itemDate = moment(dataItem.SubmittedDate).valueOf();

        var month = moment(itemDate).month();
        return month;
    }

    // Returns the title for a group
    function getGroupData(dataItem) {
        var itemDate = moment(dataItem.SubmittedDate).valueOf();
        var title = moment(itemDate).format("MMMM");

        return {
            title: title
        };
    }

    // Create the groups for the ListView from the item data and the grouping functions
    var groupedItemsList = articleList.createGrouped(getGroupKey, getGroupData, compareGroups);


    WinJS.Namespace.define("Data", {
        items: articleList,
        groupedItemsList: groupedItemsList
    });

})();