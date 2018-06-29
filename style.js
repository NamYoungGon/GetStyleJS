(function (d) {
  function isElementMatchWithCssRule(element, cssRule) {
    var proto = Element.prototype
    var matches = Function.call.bind(proto.matchesSelector ||
      proto.mozMatchesSelector || proto.webkitMatchesSelector ||
      proto.msMatchesSelector || proto.oMatchesSelector)

    return matches(element, cssRule.selectorText)
  }

  let cssRules
  let mediaRules

  function init() {
    let { styleSheets } = d
    styleSheets = Array.from(styleSheets)
    
    cssRules = styleSheets.reduce(function (rules, styleSheet) { 
      return rules.concat(Array.from(styleSheet.cssRules))
    }, [])
  
    mediaRules = cssRules.filter(function (cssRule) {
      return cssRule.type === cssRule.MEDIA_RULE
    })
  
    cssRules = cssRules.filter(function (cssRule) {
      return cssRule.type === cssRule.STYLE_RULE
    })
  
    cssRules = cssRules.concat(mediaRules.reduce(function(rules, mediaRule) {
      return rules.concat(mediaRule.cssRules);
    }, []))
  }

  function getStyleInCss(element) {
    let styles = {}

    var rulesOnElement = cssRules.filter(function (cssRule) {
      return isElementMatchWithCssRule(element, cssRule)
    });

    rulesOnElement.forEach(function (d) {
      const { cssText } = d
      let cssStr = cssText.substring(cssText.indexOf('{') + 2, cssText.length - 1)
      let splitCssStr = cssStr.split('; ')

      for (let i = 0, splitCssStrLen = splitCssStr.length; i < splitCssStrLen - 1; i++) {
        let [ name, value ] = splitCssStr[i].split(': ')

        styles[name] = value
      }
    })

    return styles
  }

  function getStyle(element) {
    let styles = {}

    Object.assign(styles, getStyleInCss(element))
    
    return styles
  }

  init();

  var Style = {
    init,
    getStyleInCss,
    getStyle
  }

  window.Style = Style
})(document)