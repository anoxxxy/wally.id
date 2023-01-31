//original code: https://gist.github.com/plugnburn/f9d3acf33bee8f3f7e2d
//modified by @anoxxxy github
!(function () {
  const isCheckbox = (el) => el.type === "checkbox";
  const isRadio = (el) => el.type === "radio";
  const isSelect = (el) => el.nodeName.toLowerCase() === "select";
  const isInputField = (el) => el.nodeName.toLowerCase() === "input-field";
  const isInput = (el) => "value" in el;
  const toSet = (v) => new Set(Array.isArray(v) ? v : [v]);

  function findElements(sel) {
    const elements = document.querySelectorAll(sel);
    if (elements.length === 0) {
      console.warn(`No elements found matching selector ${sel}`);
    }
    return [...elements];
  }
  function setElementValue(el, val, attr) {
    console.log('==setElementValue==');
    if (attr) {
      el.setAttribute(attr, val);
    } else if (isInput(el)) {
      el.value = val;
    } else if (isInputField(el)) {
      el.setAttribute("value", val);
    } else {
      console.log('el', el);
      console.log(' val', val);
      el.innerHTML = val;
    }
  }

  function setVal(sel, val, attr, l, i) {
    const elements = findElements(sel);
    console.log('elements: ', elements);
    if (elements.length === 0) return;
    var el = elements[0];

    if (isCheckbox(el)) {
      var v = toSet(val);
      elements
        .filter(isCheckbox)
        .forEach((e) => (e.checked = v.has(e.value) || v.has(e.name)));
      return;
    }

    if (isSelect(el)) {
      var v = toSet(val);
      el.querySelectorAll("option").forEach(
        (op) => (op.selected = v.has(op.value))
      );
      return;
    }

    if (isRadio(el)) {
      elements.filter(isRadio).forEach((e) => (e.checked = e.value === val));
      return;
    }

    elements.forEach((el) => setElementValue(el, val, attr));
  }

  function getVal(sel, attr, val, l, i) {
    const elements = findElements(sel);
    if (elements.length === 0) return;

    var el = elements[0];
    if (attr) return el.getAttribute(attr);
    if (!isInput(el)) return el.innerHTML;

    if (isSelect(el)) {
      const opts = [...el.querySelectorAll("option")];
      return opts.filter((op) => op.selected).map((op) => op.value);
    }

    if (isCheckbox(el)) {
      return elements
        .filter((e) => isCheckbox(e) && e.checked)
        .map((e) => (e.value === "on" ? e.name : e.value));
    }

    if (isRadio(el)) {
      console.log("is radio yes");
      el = elements.filter(isRadio).find((e) => e.checked);
      console.log("el radio: ", el);
      return el.value;
      //if (!el) return undefined;
    }

    if (isInputField(el)) {
      return el.getAttribute("value");
    }
    console.log("el ", el);
    return el.value;
  }

  window.DaBi = function (sel, obj, prop, attr, isEnum) {
    console.log('===window.DaBi===');
    Object.defineProperty(obj, prop, {
      get: function () {
        console.log('===get: function ()===');
        return getVal(sel, attr);
      },
      set: function (v) {
        console.log('===set: function ()===');
        return setVal(sel, v, attr);
      },
      configurable: true,
      enumerable: !!isEnum,
    });
  };
})();