import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// global variables
const replyOl = document.getElementById("reply-ol")
const tweetsFromLocalStorage = JSON.parse(localStorage.getItem("myTweets"))

document.addEventListener('click', function(e){

    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        openReplyModal(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'cancel') {
        closeReplyModal()
    }
    else if(e.target.dataset.tweetreply) {
        handleReplyTweet(e.target.dataset.tweetreply)
    }
    else if(e.target.dataset.viewreply) {
        viewReplies(e.target.dataset.viewreply)
    }
    else if(e.target.dataset.delreply) {
        deleteReply(e.target.dataset.delreply)
    }
    else if(e.target.dataset.deltweet) {
        deleteTweet(e.target.dataset.deltweet)
    }
})
 
function handleLikeClick(tweetId){ 
    if (tweetsFromLocalStorage) {
        const targetTweetLs = tweetsFromLocalStorage.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]
    
        if (targetTweetLs.isLiked){
            targetTweetLs.likes--
        }
        else{
            targetTweetLs.likes++ 
        }
        targetTweetLs.isLiked = !targetTweetLs.isLiked
    
        saveDataToArray(targetTweetLs)
    } else {
        const targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]
    
        if (targetTweetObj.isLiked){
            targetTweetObj.likes--
        }
        else{
            targetTweetObj.likes++ 
        }
        targetTweetObj.isLiked = !targetTweetObj.isLiked
    
        saveDataToArray(targetTweetObj)
    }
    render()
}

function handleRetweetClick(tweetId){

    if (tweetsFromLocalStorage) {
         // tweetsFromLocalStorage
        const targetTweetLs =  tweetsFromLocalStorage.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]
    
        if(targetTweetLs.isRetweeted){
            targetTweetLs.retweets--
        }
        else{
            targetTweetLs.retweets++
        }
        targetTweetLs.isRetweeted = !targetTweetLs.isRetweeted
        saveDataToArray(targetTweetLs)
    } else {
        // tweetsData
        const targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]

        
        if(targetTweetObj.isRetweeted){
            targetTweetObj.retweets--
        }
        else{
            targetTweetObj.retweets++
        }
        targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
        saveDataToArray(targetTweetObj)
        }

    render() 
}


function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if (tweetsFromLocalStorage) {
        if(tweetInput.value){
            tweetsFromLocalStorage.unshift({
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                likes: 0,
                retweets: 0,
                tweetText: tweetInput.value,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv4(),
                userTweet: true
            })
        }   

        saveToLocalStorage(tweetsFromLocalStorage)   
    }
    else {
        if(tweetInput.value){
            tweetsData.unshift({
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                likes: 0,
                retweets: 0,
                tweetText: tweetInput.value,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv4(),
                userTweet: true
            })
        }   

        saveToLocalStorage(tweetsData)   
    }
        
    

        render()
        tweetInput.value = ''

}

function deleteTweet(tweetId) {

    if(tweetsFromLocalStorage) {
        tweetsFromLocalStorage.forEach(function(tweet) {
            if (tweet.uuid === tweetId) {
                tweetsFromLocalStorage.splice(tweetsFromLocalStorage.indexOf(tweet), 1)
            }
        })
        saveToLocalStorage(tweetsFromLocalStorage)
    } else {
        tweetsData.forEach(function(tweet) {
            if (tweet.uuid === tweetId) {
                tweetsData.splice(tweetsData.indexOf(tweet), 1)
            }
        })
        saveToLocalStorage(tweetsData)
    }

    render()
}


function openReplyModal(userReplyId) {
    const targetTweetObj = tweetsData.filter(function(tweet) {
        return tweet.uuid === userReplyId
    })[0]


    let replyModalHtml = ''

    replyModalHtml = `
    <div class="top-section">
        <button class="grey-btn" id="cancel">cancel</button>
        <button class="reply-btn" data-tweetreply="${targetTweetObj.uuid}">Tweet</button>
    </div>
    <div class="reply-section">
        <div class="pfp-reply">
            <div class="line-shape"></div>
            <img class="profile-pic" src="images/scrimbalogo.png" alt="user reply Pfp">
        </div>
        <div class="reply-to">
            <h3>Replying to <span class="reply-to-user">${targetTweetObj.handle}</span></h3>
            <textarea placeholder="Tweet your reply" id="reply-input"></textarea>
        </div>
    </div>
`   
    const replyBox = document.getElementById("replyB")
    replyOl.style.display = "block"
    replyBox.style.display = "block"
    replyBox.innerHTML = replyModalHtml
    render()
}

function closeReplyModal() {
    document.getElementById("replyB").style.display = "none"
    closeReplyOverlay()
    render()
}

function handleReplyTweet(replyId) {
   const replyInput = document.getElementById('reply-input')

   if (tweetsFromLocalStorage) {
    const currentTweetLs = tweetsFromLocalStorage.filter(function(tweet) {
        return tweet.uuid === replyId
       })[0]
    
    
       if (replyInput.value) {
        currentTweetLs.replies.unshift({
            handle: '@Scrimba',
            profilePic: 'images/scrimbalogo.png',
            tweetText: replyInput.value,
            userReply: true,
            uuid: uuidv4()
        })
        }

    closeReplyOverlay()
    document.getElementById("replyB").style.display = "none"
    saveDataToArray(currentTweetLs)

   } else {
    const currentTweetObj = tweetsData.filter(function(tweet) {
        return tweet.uuid === replyId
       })[0]
    
    
       if (replyInput.value) {
        currentTweetObj.replies.unshift({
            handle: '@Scrimba',
            profilePic: 'images/scrimbalogo.png',
            tweetText: replyInput.value,
            userReply: true,
            uuid: uuidv4()
        })
        }
    
    closeReplyOverlay()
    document.getElementById("replyB").style.display = "none"
    saveDataToArray(currentTweetObj)
   }

    render()
}

function viewReplies(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle("hidden")
}

function closeReplyOverlay() {
    replyOl.style.display = "none"
}

function deleteReply(replyId) {

    if (tweetsFromLocalStorage) {
        tweetsFromLocalStorage.forEach(function(tweet) {
            tweet.replies.forEach(function(reply) {
                if (reply.uuid === replyId) {
                    tweet.replies.splice(tweet.replies.indexOf(reply), 1)
                }
            })
        })
        saveToLocalStorage(tweetsFromLocalStorage)
    } else {
        tweetsData.forEach(function(tweet) {
            tweet.replies.forEach(function(reply) {
                if (reply.uuid === replyId) {
                    tweet.replies.splice(tweet.replies.indexOf(reply), 1)
                }
            })
        })
        saveToLocalStorage(tweetsData)
    }

    render()
}

function saveDataToArray(obj) {
    
    if (tweetsFromLocalStorage) {
        tweetsFromLocalStorage.forEach(function(tweet) {
            if (tweet.uuid === obj.uuid) {
                tweetsData[tweetsData.indexOf(tweet)] = obj
            }
        })
        saveToLocalStorage(tweetsFromLocalStorage)
    } else {
        tweetsData.forEach(function(tweet) {
            if (tweet.uuid === obj.uuid) {
                tweetsData[tweetsData.indexOf(tweet)] = obj
            }
        })
        saveToLocalStorage(tweetsData)
    }


}

function saveToLocalStorage(item) {
    localStorage.setItem("myTweets", JSON.stringify(item))
}

function getFeedHtml(){
    let feedHtml = ``

    if (tweetsFromLocalStorage) {
        tweetsFromLocalStorage.forEach(function(tweet){
        
            let likeIconClass = ''
            
            if (tweet.isLiked){
                likeIconClass = 'liked'
            }
            
            let retweetIconClass = ''
            
            if (tweet.isRetweeted){
                retweetIconClass = 'retweeted'
            }
            
            let repliesHtml = ''
            
            if(tweet.replies.length > 0){
                tweet.replies.forEach(function(reply){

                    if (reply.userReply === true) {
                        repliesHtml+=`
                        <div class="tweet-reply">
                            <div class="tweet-inner">
                            <i class="fas fa-minus del-btn" data-delreply="${reply.uuid}"></i>
                                <img src="${reply.profilePic}" class="profile-pic">
                                    <div>
                                        <p class="handle">${reply.handle}</p>
                                        <p class="tweet-text">${reply.tweetText}</p>
                                    </div>
                                </div>
                        </div>
                        `
                    } else {
                        repliesHtml+=`
                        <div class="tweet-reply">
                            <div class="tweet-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                    <div>
                                        <p class="handle">${reply.handle}</p>
                                        <p class="tweet-text">${reply.tweetText}</p>
                                    </div>
                                </div>
                        </div>
                        `
                    }
                   
                })
            }
            
            // checking userTweet
            if (tweet.userTweet)  {
                feedHtml += `
    <div class="tweet">
        <div class="tweet-inner">
            <i class="fas fa-minus del-btn" data-deltweet="${tweet.uuid}"></i>    
            <img src="${tweet.profilePic}" class="profile-pic">
            <div id="view-reply" data-viewreply="${tweet.uuid}">
                <p class="handle" id="view-reply" data-viewreply="${tweet.uuid}">${tweet.handle}</p>
                <p class="tweet-text" id="view-reply" data-viewreply="${tweet.uuid}">${tweet.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots"
                        data-reply="${tweet.uuid}"
                        ></i>
                        ${tweet.replies.length}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likeIconClass}"
                        data-like="${tweet.uuid}"
                        ></i>
                        ${tweet.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                        data-retweet="${tweet.uuid}"
                        ></i>
                        ${tweet.retweets}
                    </span>
                </div> 
            </div>            
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
            ${repliesHtml}
        </div>   
    </div>
    `
            } else {
                feedHtml += `
    <div class="tweet">
        <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic">
            <div id="view-reply" data-viewreply="${tweet.uuid}">
                <p class="handle" id="view-reply" data-viewreply="${tweet.uuid}">${tweet.handle}</p>
                <p class="tweet-text" id="view-reply" data-viewreply="${tweet.uuid}">${tweet.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots"
                        data-reply="${tweet.uuid}"
                        ></i>
                        ${tweet.replies.length}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likeIconClass}"
                        data-like="${tweet.uuid}"
                        ></i>
                        ${tweet.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                        data-retweet="${tweet.uuid}"
                        ></i>
                        ${tweet.retweets}
                    </span>
                </div> 
            </div>            
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
            ${repliesHtml}
        </div>   
    </div>
    `
            }
            
       })
    } else {
        tweetsData.forEach(function(tweet){
        
            let likeIconClass = ''
            
            if (tweet.isLiked){
                likeIconClass = 'liked'
            }
            
            let retweetIconClass = ''
            
            if (tweet.isRetweeted){
                retweetIconClass = 'retweeted'
            }
            
            let repliesHtml = ''
            
            if(tweet.replies.length > 0){
                tweet.replies.forEach(function(reply){
                    if (reply.userReply === true) {
                        repliesHtml+=`
                        <div class="tweet-reply">
                            <div class="tweet-inner">
                            <i class="fas fa-minus del-btn" data-delReply="${reply.uuid}"></i>
                                <img src="${reply.profilePic}" class="profile-pic">
                                    <div>
                                        <p class="handle">${reply.handle}</p>
                                        <p class="tweet-text">${reply.tweetText}</p>
                                    </div>
                                </div>
                        </div>
                        `
                    } else {
                        repliesHtml+=`
                        <div class="tweet-reply">
                            <div class="tweet-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                    <div>
                                        <p class="handle">${reply.handle}</p>
                                        <p class="tweet-text">${reply.tweetText}</p>
                                    </div>
                                </div>
                        </div>
                        `
                    }
                })
            }
            
            if (tweet.userTweet) {
                feedHtml += `
    <div class="tweet">
        <div class="tweet-inner">
            <i class="fas fa-minus del-btn" data-deltweet="${tweet.uuid}"></i>
            <img src="${tweet.profilePic}" class="profile-pic">
            <div id="view-reply" data-viewreply="${tweet.uuid}">
                <p class="handle" id="view-reply" data-viewreply="${tweet.uuid}">${tweet.handle}</p>
                <p class="tweet-text" id="view-reply" data-viewreply="${tweet.uuid}">${tweet.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots"
                        data-reply="${tweet.uuid}"
                        ></i>
                        ${tweet.replies.length}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likeIconClass}"
                        data-like="${tweet.uuid}"
                        ></i>
                        ${tweet.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                        data-retweet="${tweet.uuid}"
                        ></i>
                        ${tweet.retweets}
                    </span>
                </div> 
            </div>            
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
            ${repliesHtml}
        </div>   
    </div>
    `
            } else {
                feedHtml += `
    <div class="tweet">
        <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic">
            <div id="view-reply" data-viewreply="${tweet.uuid}">
                <p class="handle" id="view-reply" data-viewreply="${tweet.uuid}">${tweet.handle}</p>
                <p class="tweet-text" id="view-reply" data-viewreply="${tweet.uuid}">${tweet.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots"
                        data-reply="${tweet.uuid}"
                        ></i>
                        ${tweet.replies.length}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likeIconClass}"
                        data-like="${tweet.uuid}"
                        ></i>
                        ${tweet.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                        data-retweet="${tweet.uuid}"
                        ></i>
                        ${tweet.retweets}
                    </span>
                </div> 
            </div>            
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
            ${repliesHtml}
        </div>   
    </div>
    `
            }
              
       })
    }
    
   return feedHtml 
}


function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

