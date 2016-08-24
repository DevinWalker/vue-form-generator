import { expect } from "chai";
import { createVueField } from "../util";

import Vue from "vue";
import fieldNoUiSlider from "src/fields/fieldNoUiSlider.vue";

Vue.component("fieldNoUiSlider", fieldNoUiSlider);

// eslint-disable-next-line
let el, vm, field;

function createField(schema = {}, model = null, disabled = false, options) {
	[ el, vm, field ] = createVueField("fieldNoUiSlider", schema, model, disabled, options);
}

describe("fieldNoUiSlider.vue", () => {

	describe("check template", () => {
		let schema = {
			type: "range",
			label: "Rating",
			model: "rating",
			min: 1,
			max: 10
		};
		let model = { rating: 8 };
		let input;

		before( () => {
			createField(schema, model, false);
			input = el.getElementsByClassName("slider")[0];
		});

		it("should contain a div element", () => {
			expect(field).to.be.exist;
			expect(field.$el).to.be.exist;

			expect(input).to.be.defined;
			expect(input.classList.contains("slider")).to.be.true;
			expect(input.disabled).to.be.undefined;
		});

		before( () => {
			vm.$appendTo(document.body);
		});

		it("should contain an handle element", (done) => {
			if (window.noUiSlider) {
				vm.$nextTick( () => {
					let handle = input.querySelector(".noUi-handle");
					expect(handle).to.be.defined;
					expect(input.classList.contains("noUi-target")).to.be.true;
					done();
				});
			} else {
				// eslint-disable-next-line
				throw new Exception("Library is not loaded");
			}
		});

		it("should contain the value", (done) => {
			vm.$nextTick( () => {
				let origin = input.querySelector(".noUi-origin");				
				expect(origin.style.left).to.be.within("70%", "90%");
				done();
			});
		});

		it("handle value should be the model value after changed", (done) => {
			field.model = { rating: 10 };
			setTimeout( () => {
				let origin = input.querySelector(".noUi-origin");				
				expect(origin.style.left).to.be.equal("100%");				
				done();
			}, 100);
		});

		it("model value should be the handle value after changed", (done) => {
			// `field.slider.noUiSlider.set(3);`	- It doesn't fired the onChange event 
			field.onChange(3);
			setTimeout( () => {
				expect(vm.model.rating).to.be.equal(3);				
				done();
			}, 100);
		});
		
		it("should set disabled", (done) => {			
			field.disabled = true;
			vm.$nextTick( () => {
				// This is not real input, it is a div. So we can check the disabled attribute
				expect(input.hasAttribute("disabled")).to.be.true;
				done();
			});
		});
	});
});
