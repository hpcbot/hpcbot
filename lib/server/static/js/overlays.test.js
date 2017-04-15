/* overlays.spec.js - client-side Tests for Twitch Overlays  */

casper.test.begin('testing.html contains stuff', 1, function (test) {
    casper.start('http://localhost:3000', function () {
        casper.waitForSelector('.sortinghat', function() {
			test.assertExists('.sortinghat');
		});
    });

    // casper.then(function () {
    //     this.click('button');
    //     test.assertSelectorHasText('h1', 'New title');
    // });

    casper.run(function() {
        test.done();
    });
});