﻿(function () {
    "use strict";

    var articleList = new WinJS.Binding.List();

    WinJS.xhr({ url: "http://metro-weekly.com/article/getapproved" }).then(function (result) {
        var articles = JSON.parse(result.response);
        
        articles.forEach(function (i) {
            i.twitterImage = "https://api.twitter.com/1/users/profile_image?screen_name=" + i.Twitter;
            i.twitterUrl = "https://twitter.com/" + i.Twitter;

            i.Name = i.UserName;
            if (i.UserName != null) {
                if(i.Name.split(' ').length>0)
                    i.FirstName = i.Name.split(' ')[0];
                if (i.Name.split(' ').length > 1)
                    i.LastName = i.Name.split(' ')[1];
            }
            
            var itemDate = moment(i.SubmittedDate).valueOf();
            i.ArticleDate = moment(itemDate).format("MMM DD YYYY");

            var Category = i.Category;
            switch (Category) {
                case "app of the week":
                    i.Category = "item-overlay lightGreen";
                    break;
                case "on the surface":
                    i.Category = "item-overlay lightRose";
                    break;
                case "reading material":
                    i.Category = "item-overlay lightBlue";
                    break;
                case "app of the week":
                    i.Category = "item-overlay lightOrange";
                    //break;
                case "sample\package of the week":
                    i.Category = "item-overlay lightGold";
                    break;
                default:
                    i.Category = "item-overlay lightGray";
            }

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