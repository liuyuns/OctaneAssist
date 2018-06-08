

var regexAgm = /saas.hp(.*).com\//

var regexOctane = /.[a-z]*octane.com\//

function isAgmSite(url){
    return regexAgm.test(url) || false
}

function isOctaneSite(url){
  return regexOctane.test(url) || false
}