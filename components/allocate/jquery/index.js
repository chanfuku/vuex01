export function initCarousel() {
  $(function() {
    // prev,nextをクリックしたときに動かすliの数
    const liMove = 1
    // prev,nextを追加
    // カルーセルパネルの幅を取得
    const carouselWid = $('#carouselwrap').width()
    // liのpaddingを含む幅を取得
    const liWid = $('#Tree li').outerWidth()
    // liの数を取得
    let liNum = $('#Tree li').length
    // ulの幅を計算(liを全部横に並べた幅)
    let ulWid = liWid * liNum
    // ulにスタイルを追加
    $('#Tree ul').css({
      position: 'absolute',
      top: '0',
      left: '0',
      width: ulWid + 'px'
    })

    // 次へボタンの有効・無効判定
    let ulPos = boxPosition('#Tree ul', 'left')
    if (carouselWid > ulWid + ulPos) {
      $('#next')
        .removeClass('show')
        .addClass('hide')
    } else {
      $('#next')
        .removeClass('hide')
        .addClass('show')
    }

    // li > .e-fullrowのleftを変更 (drag and dropを実行する際に必要なため)
    const gap = 3
    const width = 280
    const origin = 170
    $('#Tree li').map(function(index, e) {
      const value = index * width + origin + gap
      $(this)
        .find('.e-fullrow')
        .offset({ left: value })
    })

    $('#prev').click(function() {
      if ($(this).hasClass('show')) {
        liNum = $('#Tree li').length
        ulWid = liWid * liNum
        // ulのpositionを左に動かすアニメーション(:not(:animated)は動いている最中のクリック防止用)
        $('#Tree ul:not(:animated)').animate(
          { left: '+=' + liWid * liMove },
          600,
          function() {
            // アニメーションが完了したらulのposition-leftの位置を取得
            ulPos = boxPosition('#Tree ul', 'left')
            $('#next')
              .removeClass('hide')
              .addClass('show')
            if (ulPos === 0) {
              $('#prev')
                .removeClass('show')
                .addClass('hide')
            }
          }
        )
      }
    })
    $('#next').click(function() {
      if ($(this).hasClass('show')) {
        liNum = $('#Tree li').length
        ulWid = liWid * liNum
        $('#Tree ul:not(:animated)').animate(
          { left: '-=' + liWid * liMove },
          600,
          function() {
            ulPos = boxPosition('#Tree ul', 'left')
            $('#prev')
              .removeClass('hide')
              .addClass('show')
            if (carouselWid > ulWid + ulPos) {
              $('#next')
                .removeClass('show')
                .addClass('hide')
            }
          }
        )
      }
    })
    function boxPosition(ele, pos) {
      // 指定されたエレメントのpositionの各値を取得
      const position = $(ele).position()
      // 指定された位置の値をリターン
      return position[pos]
    }
  })
}

export function initScheduleHeader(currentView) {
  console.log(currentView)
  if (currentView === 'TimelineWeek') {
    $('col').map(function(index, e) {
      $(this).css('width', '7px')
    })
    $('.e-header-row:eq(1)').map(function(index, e) {
      $(this).hide()
    })
  } else {
    $('.e-header-row:eq(1)').map(function(index, e) {
      $(this).show()
    })
  }
}
