module.exports = function(eleventyConfig) {
    return {
        dir: {
            input: "src",     // Set input directory
            includes: "_includes", // Default includes directory inside src/
            output: "_site",  // Default output folder
        }
    };
};
