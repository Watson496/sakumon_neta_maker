// JavaScript Document
var data = []; // JSONから読み込んだカテゴリーデータを格納する配列
var date_today = new Date();

function getJSON() {
	// fetchAPIを用いてJSONファイルを読み込む
	fetch('category.json').then(function(response) {
		return response.json();
	}).then(function(json) {
		data = JSON.parse(JSON.stringify(json));
	})
}

class Random {
	/*
	  ブログ記事「JavaScriptで再現性のある乱数を生成する + 指定した範囲の乱数を生成する」より作成。
	  https://sbfl.net/blog/2017/06/01/javascript-reproducible-random/
	*/
	constructor(seed = 88675123) {
		this.x = 123456789;
		this.y = 362436069;
		this.z = 521288629;
		this.w = seed;
	}

	// XorShift
	next() {
		let t;
		
		t = this.x ^ (this.x << 11);
		this.x = this.y; this.y = this.z; this.z = this.w;
		return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8)); 
	}
	
	// min以上max以下の乱数を生成する
	nextInt(min, max) {
		const r = Math.abs(this.next());
		return min + (r % (max + 1 - min));	
	}
}

function button_click() {
	// 入力された名前を取得
	var username = document.forms.enter.input.value;
	
	// 乱数のシード値を生成
	var charcode_username = 0;
	for (i=0; i<username.length; i++){
		charcode_username += username.charCodeAt(i);
	}
	
	var year = date_today.getFullYear();
	var month = date_today.getMonth()+1;
	var day = date_today.getDate();
	
	var seed = charcode_username + year + month + day;
	
	// 乱数を生成して3つのカテゴリーを抽出
	const random = new Random(seed);
	var data_len = data.length;
	
	var fetched_categories = [];
	for (i=0; i<3; i++){
		var data_id = random.nextInt(0, data_len);
		fetched_categories.push(data[data_id].name);
	}
	
	// 結果を表示
	result_str = username + "さんは<br><br>"
		+ "・" + fetched_categories[0] + "<br>"
		+ "・" + fetched_categories[1] + "<br>"
		+ "・" + fetched_categories[2]
		+ "<br><br>で問題を作ってください。"
	
	var shindanresult_block = document.getElementById("shindanresult_block");
	shindanresult_block.style.display = "block";
	
	var shindanresult = document.getElementById("shindanresult");
	shindanresult.innerHTML = result_str;
	
	// ツイート用のエリアを表示
	var tweetform_block = document.getElementById("tweetform_block");
	tweetform_block.style.display = "block";
	
	result_str_for_uri = username + "さんは\n" + "\n"
		+ "・" + fetched_categories[0] + "\n"
		+ "・" + fetched_categories[1] + "\n"
		+ "・" + fetched_categories[2] + "\n"
		+ "\nで問題を作ってください。" + "\n"
	var encoded_result_str = encodeURI(result_str_for_uri);
	var hashtag = "作問ネタメーカー"
	var encoded_hashtag = encodeURI(hashtag)
	var tweetlink_url = "https://twitter.com/intent/tweet?text=" + encoded_result_str
		+ "%23" + encoded_hashtag + "%0a" + location.href;
	var a_twitter = document.getElementById("a_twitter");
	a_twitter.href = tweetlink_url;
	
	/*
	// コピペ用のエリアを表示
	var forcopy_block = document.getElementById("forcopy_block");
	forcopy_block.style.display = "block";
	var forcopy_textarea = document.getElementById("forcopy_textarea")
	forcopy_textarea.value = "test";
	*/
}

window.onload = getJSON();