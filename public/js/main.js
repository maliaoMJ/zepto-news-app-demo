// 基于zepto.js 和 app.js Demo
// github:https://github.com/maliaomj 
// 
// 
// 
	//Dom template
	// let domtemplate = `<li class="news-list">
 //     		<div class="app-button news_item" data-target="detail" id="${id}">
 //     			<img src="${imgUrl}">
 //     			<div class="content_text">
 //     				<p class="text">${title}</p>
 //     			</div>
 //     		</div>
 //     	</li>`
 var articleId = '';
 function getDomTree(data){
 let domtemplate = `<li class="news-list">
     		<div class="news_item"  id="${data.id}">
     			<img src="${data.imgUrl}">
     			<div class="content_text">
     				<p class="text">${data.title}</p>
     			</div>
     		</div>
     	</li>`
     	return domtemplate	

 }
 function toDetail(articleId){
 	//go to detail apge
 	
  	App.load('detail')
  
 }
 function formatTime(timeStamp){
 	//时间API提供的有问题可写可不写
 	let date = new Date(timeStamp)
 	let year = date.getFullYear()
 	let month = (date.getMonth()+1)>10?(date.getMonth()+1):'0'+(date.getMonth()+1)
 	let day = date.getDate()>10?date.getDate():'0' + date.getDate()
 	let timers = year +' '+month+' '+day  
 	return timers
 }
 function toComments(){
 	//go to comments apge
 	App.load('comments')
 }
//统一数据 封装函数

function uniteData(data){
    var result = []
	for(let i = 0 ;i < data.length; i++){
		let tempObj = {
			id:data[i].id,
			imgUrl:'/api/image?img='+data[i].images[0],
			title:data[i].title
		}
		result.push(tempObj)
	}
	return result

} 
function uniteComments(data){
	var commentsData = ''
	for(let i =0;i<data.length;i++){
		let commentsTemp = `<div class="comment_item">
			<div class="item_header">
				<img src="/api/image?img=${data[i].avatar}"/>
				<span class="user_name">${data[i].author}</span>
				<span class="time">${formatTime(data[i].time)}</span>
			</div>
			<div class="item_body">
				<span>${data[i].content}</span>
			</div>
		</div>`
		commentsData +=commentsTemp
	}
	return commentsData
}

App.controller('home', (page) =>{
	// apge DOM 节点对象

 //获取DOM对象
    var contentbox = $(page).find('#news_box')
    //向后台请求首页新闻数据
	$.getJSON('/api/news',function(response){
	
	    let data = uniteData(response.stories)
	    let temStr = ''
	    for(let i= 0 ;i<data.length;i++){
	    	temStr+=getDomTree(data[i])
	    }
	    let templateHtml =  $(temStr)
	    contentbox.append(templateHtml)

	    var DomItems = $(page).find('.news_item')
	    
	    for(let i= 0;i<DomItems.length;i++){
	       let tempDom = $(DomItems[i])
	       tempDom.on('click', function(event){
	       	articleId = $(this).attr('id')
	       	toDetail(articleId)
			event.preventDefault()
			event.stopPropagation()
	       })


	    }
    })

})
App.controller('detail', (page) =>{

  if(articleId){
   $.getJSON(`/api/detail?id=${articleId}`,function(data){
   var dataObj = JSON.parse(data)
   	console.log(dataObj)
   	let contentDetailBox = $(page).find('#content_detail')
   	let DomTemp = $(dataObj.body)
   	let images = DomTemp.find('img')
   	images.forEach( function(element, index) {
  	
   		$(element).attr('src',`/api/image?img=${$(element).attr('src')}`)
   	});

   	
   	contentDetailBox.append(DomTemp) 

   })
  }else{
  	//没有获取到文章的ID
  	console.log("don't get articleId")
  }
})
App.controller('comments', (page) =>{
if(articleId){
   $.getJSON(`/api/comments?id=${articleId}`,function(data){
    console.log(data.comments)
    let DomComments = $(uniteComments(data.comments))
    let commentsBox = $(page).find('#commentsBox')
    commentsBox.append(DomComments)
   })
  }else{
  	//没有获取到文章的ID
  	console.log("don't get articleId")
  }
})
try{
	App.restore()
}catch(err){
  App.load('home')
}
