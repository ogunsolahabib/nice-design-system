/* eslint-env node, mocha */

const should = require("should");

const KeyCodes = {
	Enter: 13,
	Space: 32,
	End: 35,
	Home: 36,
	LeftArrow: 37,
	UpArrow: 38,
	RightArrow: 39,
	DownArrow: 40
};

describe("Tabs", function() {

	var $,
		document,
		Tabs;

	var tabsHTML = `
		<div class="tabs" data-nice-plugin="tabs">
			<nav>
				<ul class="tabs__list" role="tablist">
					<li class="tabs__tab" role="presentation">
						<button class="tabs__tab-btn" type="button" role="tab">
							Tab 1
						</button>
					</li>
					<li class="tabs__tab" role="presentation">
						<button  class="tabs__tab-btn"type="button" role="tab">
							Tab 2
						</abutton>
					</li>
					<li class="tabs__tab" role="presentation">
						<button class="tabs__tab-btn" type="button" role="tab">
							Tab 3
						</abutton>
					</li>
				</ul>
			</nav>
			<div class="tabs__content">
				<div lass="tabs__pane" role="tabpanel">
					<h2>First tab</h2>
					<p>This is the content for tab 1</p>
				</div>
				<div class="tabs__pane" role="tabpanel">
					<h2>Second tab</h2>
					<p>This is the content for tab 2</p>
				</div>
				<div class="tabs__pane" role="tabpanel">
					<h2>Third tab</h2>
					<p>This is the content for tab 3</p>
				</div>
			</div>
		</div>
	`;

	before(function () {
		document = global.document;
		$ = global.$;

		Tabs = require("../../src/javascripts/tabs.js").default;
	});

	describe("jQuery integration", function() {

		it("defined on jquery object", function() {
			$(document).tabs.should.be.ok();
		});

		it("have defaults", function() {
			$(document).tabs.should.have.property("defaults");
		});

		// TODO: Test no conflict

		it("return jquery collection containing the element", function() {
			var $el = $("<div/>");
			var $tabs = $el.tabs();

			$tabs.should.be.an.instanceOf($, "returns jquery collection");
			$tabs[0].should.equal($el[0], "collection contains element");
		});

		it("getter can be called", function() {
			var $el = $(tabsHTML).tabs();
			($el.tabs("getCurrentIndex")).should.equal(0);
		});

		it("method can be called", function() {
			var $el = $(tabsHTML).tabs();
			$el.tabs("activate", 1);
			($el.tabs("getCurrentIndex")).should.equal(1);
		});
	});

	describe("Initialization", function() {

		it("have defaults", function() {
			Tabs.should.have.property("defaults");
		});

		it("throw without element", function() {
			should.throws(() => new Tabs);
		});

	});

	describe("Tab selection", function() {

		it("first tab selected by default", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);
			t.getCurrentIndex().should.equal(0);
		});

		it("tab can be activated by index", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);
			t.activate(1);
			t.getCurrentIndex().should.equal(1);
		});

		it("last tab can be activated", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);
			t.last();
			(t.getCurrentIndex()).should.equal(2);
		});

		it("first tab can be activated", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);
			t.last();
			t.first();
			(t.getCurrentIndex()).should.equal(0);
		});

		it("next tab can be activated", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);
			t.next();
			(t.getCurrentIndex()).should.equal(1);
		});

		it("next tab activates first from last", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);
			t.last();
			t.next();
			(t.getCurrentIndex()).should.equal(0);
		});

		it("previous tab can be activated", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);
			t.last();
			t.previous();
			(t.getCurrentIndex()).should.equal(1);
		});

		it("previous tab activates last from first", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);
			t.previous();
			(t.getCurrentIndex()).should.equal(2);
		});
	});


	describe("Accessibility", function() {

		it("active tab is aria-selected", function() {
			var $el = $(tabsHTML);
			new Tabs($el);
			$("[role='tab']:eq(0)", $el).attr("aria-expanded").should.equal("true");
			$("[role='tab']:eq(0)", $el).attr("aria-selected").should.equal("true");
		});

		it("inactive tabs are not aria-selected", function() {
			var $el = $(tabsHTML);
			new Tabs($el);
			$("[role='tab']:gt(0)", $el).attr("aria-expanded").should.equal("false");
			$("[role='tab']:gt(0)", $el).attr("aria-selected").should.equal("false");
		});

	});

	describe("Keyboard control", function() {

		it("left/up keydown on tab selects previous tab", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);

			t.getCurrentIndex().should.equal(0);

			$("[role='tab']:eq(0)", $el)
				.focus()
				.trigger($.Event("keydown", { which: KeyCodes.LeftArrow } ));

			t.getCurrentIndex().should.equal(2);

			$("[role='tab']:eq(2)", $el)
				.focus()
				.trigger($.Event("keydown", { which: KeyCodes.UpArrow } ));

			t.getCurrentIndex().should.equal(1);
		});

		it("down/right keydown on tab selects next tab", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);

			t.getCurrentIndex().should.equal(0);

			$("[role='tab']:eq(0)", $el)
				.focus()
				.trigger($.Event("keydown", { which: KeyCodes.RightArrow } ));

			t.getCurrentIndex().should.equal(1);

			$("[role='tab']:eq(1)", $el)
				.focus()
				.trigger($.Event("keydown", { which: KeyCodes.DownArrow } ));

			t.getCurrentIndex().should.equal(2);
		});

		it("end keydown on tab selects last tab", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);

			t.getCurrentIndex().should.equal(0);

			$("[role='tab']:eq(0)", $el)
				.focus()
				.trigger($.Event("keydown", { which: KeyCodes.End } ));

			t.getCurrentIndex().should.equal(2);
		});

		it("home keydown on tab selects last tab", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);

			t.last();

			t.getCurrentIndex().should.equal(2);

			$("[role='tab']:eq(2)", $el)
				.focus()
				.trigger($.Event("keydown", { which: KeyCodes.Home } ));

			t.getCurrentIndex().should.equal(0);
		});

		it("enter/space keydown on selects focussed tab", function() {
			var $el = $(tabsHTML);
			var t = new Tabs($el);

			t.getCurrentIndex().should.equal(0);

			$("[role='tab']:eq(1)", $el)
				.focus()
				.trigger($.Event("keydown", { which: KeyCodes.Space } ));

			t.getCurrentIndex().should.equal(1);

			$("[role='tab']:eq(2)", $el)
				.focus()
				.trigger($.Event("keydown", { which: KeyCodes.Enter } ));

			t.getCurrentIndex().should.equal(2);
		});

	});
});