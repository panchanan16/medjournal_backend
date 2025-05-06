export function arrangeReviewerList(reviewers) {
    // Create a map to store reviewers by month
    const monthMap = new Map();

    // Iterate through each reviewer
    reviewers.forEach(reviewer => {
        const monthName = reviewer.month.charAt(0).toUpperCase() + reviewer.month.slice(1).toLowerCase();

        if (!monthMap.has(monthName)) {
            monthMap.set(monthName, []);
        }
        monthMap.get(monthName).push(reviewer);
    });

    // Convert map to array of objects
    const result = [];
    monthMap.forEach((reviewers, month) => {
        const monthObj = {};
        monthObj.month = month
        monthObj.names = reviewers
        // monthObj[month] = reviewers;
        result.push(monthObj);
    });

    return result;
}

