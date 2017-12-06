App.controller('home', (page) =>{

})
App.controller('page2', (page) =>{

})
App.controller('page3', (page) =>{

})
try{
	App.restore()
}catch(err){
  App.load('home')
}