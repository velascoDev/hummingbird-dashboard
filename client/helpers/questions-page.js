var questionText, questionId, questionDate, questions, currentDate, currentDate, index, row;
function formatTime(duration) {
    duration = duration/1000;
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var datePosted = 0;
    while(duration >= 3600*24){
      days++;
      duration = duration - 24*3600;
    }
    while(duration >= 3600){
      hours++;
      duration = duration-3600;
    }
    while(duration >= 60){
      minutes++
      duration = duration-60;
    }
    datePosted = {days: days, hours: hours, minutes: minutes};
    if(datePosted.days === 1){
    	datePosted = "1 day"; 
    } else if(datePosted.days > 1){
    	datePosted = datePosted.days+" days" ;
    } else if(datePosted.hours === 1){
    	datePosted = "1 hr";
    } else if(datePosted.hours > 1){
    	datePosted = datePosted.hours+" hrs";
    }else if(datePosted.minutes >=0 && datePosted.minutes <= 1){
    	datePosted = "1 min";
    } else if(datePosted.minutes > 1){
    	datePosted = datePosted.minutes+" min";
    }
    return datePosted;
}
Template.questionsPage.onCreated(function questionsOnCreated() {
  Meteor.subscribe('questions');
  document.title = "Questions - Live";
});
Template.questionsPage.helpers({
	lectureObj : function(){
		lectureObj = this;
		return lectureObj; 
	}, 
	questions : function(){
	currentDate = new Date();
	questions = Questions.find({}, {sort:{date: -1}}).map(function(question){
		question.datePosted = formatTime(currentDate.getTime() - question.date);
		return question;
	});
	return questions;
	}
});
Template.questionsPage.events({
	'click #new-question-submit': function(event){
		questionText = $('#question-input').val();
		Meteor.call('Questions.insert', {text: questionText});			
		$('#question-input').val('');
		$('.collapse').collapse('hide');	
	},
	'click #discard-new-question': function(event){
		$('.collapse').collapse('hide');
		$('#question-input').val('');
	},
	'click .question-menu-dd': function(event){
		questionId = $(event.currentTarget.parentNode.parentNode.parentNode).attr('id');
		$('#'+questionId+ ' .question-edit').animate({height: 'toggle'}, 200);
	}, 
	'click .question-item-delete': function(event){
		questionId = $(event.currentTarget.parentNode.parentNode.parentNode.parentNode).attr('id');
		row = $(event.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode).animate({opacity: 0, height: 'toggle'}, 300);
		setTimeout(function(){
			Meteor.call('Questions.remove', questionId);	
		}, 1000);
	},
	'click .question-item-edit': function(event){
		questionId = $(event.currentTarget.parentNode.parentNode.parentNode.parentNode).attr('id');
		// row = $(event.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode).animate({opacity: 0, height: 'toggle'}, 300);
		questionText = $('#'+questionId+ '.thumbnail .question').text();
		$('#question-edit-input').val(questionText);
		$('#'+questionId+ ' .question-edit').animate({height: 'toggle'}, 200);
		$('#question-edit').fadeIn(300);
		$('.mask').fadeIn(300);
	},
	'click .question-edit-discard': function(event){
		$('#question-edit').fadeOut(300);
		$('.mask').fadeOut(300);
	}

});
