import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dataPath = resolve(process.cwd(), 'public', 'data', 'tarot.json');
const currentPayload = JSON.parse(await readFile(dataPath, 'utf8'));

const majorTranslations = {
  major_00: {
    name_vi: 'Kẻ Khờ',
    keywords_upright: ['khởi đầu', 'tự do', 'niềm tin', 'phiêu lưu'],
    keywords_reversed: ['liều lĩnh', 'thiếu chuẩn bị', 'do dự', 'mất hướng'],
    meaning_upright:
      'Lá bài này nói về một ngưỡng của hành trình mới, khi bạn chưa biết hết mọi thứ nhưng vẫn có động lực bước tới. Nó khuyên bạn giữ sự trong trẻo, tin vào trực giác và để mình được học hỏi qua trải nghiệm.',
    meaning_reversed:
      'Khi đảo ngược, The Fool cảnh báo về sự hấp tấp hoặc nhảy vào một hướng đi khi chưa có nền tảng rõ ràng. Bạn vẫn có thể bắt đầu, nhưng nên chậm lại một nhịp để kiểm tra kỳ vọng, rủi ro và mức độ sẵn sàng của mình.'
  },
  major_01: {
    name_vi: 'Pháp Sư',
    keywords_upright: ['chủ động', 'kiến tạo', 'tập trung', 'hiện thực hóa'],
    keywords_reversed: ['phân tán', 'thao túng', 'thiếu kỹ năng', 'dùng sai năng lượng'],
    meaning_upright:
      'The Magician cho thấy bạn đã có đủ công cụ để biến một ý tưởng thành hành động cụ thể. Lá bài nhấn mạnh sức mạnh của ý chí, sự tự tin và khả năng kết nối tài nguyên đúng lúc.',
    meaning_reversed:
      'Ở chiều ngược, năng lượng này dễ bị tản mạn hoặc bị dùng theo cách không trung thực. Bạn cần quay lại với mục đích thật sự, tránh hiệu ứng làm nhiều nhưng không đúng trọng tâm.'
  },
  major_02: {
    name_vi: 'Nữ Tu Sĩ',
    keywords_upright: ['trực giác', 'bí ẩn', 'lắng nghe', 'nội tâm'],
    keywords_reversed: ['bỏ qua tín hiệu', 'rối trí', 'giấu kín', 'mất cân bằng'],
    meaning_upright:
      'Lá bài này mời bạn lắng lại để nghe điều mình đã biết từ bên trong nhưng chưa gọi tên được. The High Priestess thường xuất hiện khi câu trả lời không nằm ở hành động mạnh mẽ, mà nằm ở sự tĩnh lặng và quan sát tinh tế.',
    meaning_reversed:
      'Khi đảo ngược, bạn có thể đang bỏ qua trực giác của chính mình hoặc bị nhiều thông tin bề ngoài làm rối. Đây là lúc nên giảm tốc, bớt tiếng ồn và xác định xem điều gì đang bị ẩn đi.'
  },
  major_03: {
    name_vi: 'Nữ Hoàng',
    keywords_upright: ['phong phú', 'nuôi dưỡng', 'sáng tạo', 'ấm áp'],
    keywords_reversed: ['cạn kiệt', 'phụ thuộc', 'lãng quên bản thân', 'trì trệ'],
    meaning_upright:
      'The Empress gợi đến sự sinh sôi, đủ đầy và khả năng chăm sóc để một điều gì đó lớn lên đúng nhịp. Lá bài này rất hợp với ý tưởng sáng tạo, tinh thần nuôi dưỡng và mối quan hệ biết quan tâm đúng mức.',
    meaning_reversed:
      'Ở thế ngược, năng lượng nuôi dưỡng có thể đang bị mất cân bằng, khi bạn cho đi quá nhiều hoặc bỏ mặc nhu cầu của mình. Cần trở lại với nhịp độ lành mạnh, chăm sóc thân tâm và nguồn lực thực tế.'
  },
  major_04: {
    name_vi: 'Hoàng Đế',
    keywords_upright: ['cấu trúc', 'kỷ luật', 'bảo vệ', 'thẩm quyền'],
    keywords_reversed: ['cứng nhắc', 'kiểm soát quá mức', 'bảo thủ', 'mất ổn định'],
    meaning_upright:
      'The Emperor đại diện cho việc dựng khung, đặt giới hạn và quản lý một cách rõ ràng để mọi thứ vận hành bền vững. Nó nhắc bạn rằng sự tự do lâu dài cần được nâng đỡ bởi cấu trúc và trách nhiệm.',
    meaning_reversed:
      'Khi đảo ngược, lá bài này thường chỉ ra sự cưỡng ép, quá kiểm soát hoặc những nguyên tắc đã không còn phù hợp. Điều cần làm là sửa lại hệ thống, không phải bỏ tất cả kỷ luật.'
  },
  major_05: {
    name_vi: 'Giáo Hoàng',
    keywords_upright: ['truyền thống', 'học hỏi', 'giá trị', 'nghi lễ'],
    keywords_reversed: ['rập khuôn', 'giọng cũ', 'phủ định hệ thống', 'cứng nhắc'],
    meaning_upright:
      'The Hierophant nói đến kiến thức được truyền lại, khuôn mẫu, đạo đức và các giá trị chung giúp bạn định vị mình. Nó phù hợp khi bạn cần học bài bản, tìm người hướng dẫn hoặc xác định một nền tảng niềm tin.',
    meaning_reversed:
      'Ở chiều ngược, lá bài này đặt câu hỏi xem quy tắc hiện tại còn phục vụ bạn hay không. Bạn có thể cần một cách học hoặc một niềm tin mang tính cá nhân hơn, thay vì chỉ làm theo số đông.'
  },
  major_06: {
    name_vi: 'Người Yêu',
    keywords_upright: ['kết nối', 'lựa chọn', 'hòa hợp', 'chân thành'],
    keywords_reversed: ['lệch giá trị', 'đổ vỡ', 'phân vân', 'xa cách'],
    meaning_upright:
      'The Lovers không chỉ nói về tình yêu mà còn là lá bài của sự đồng điệu trong giá trị và lựa chọn. Nó mời bạn xét xem điều gì thật sự phù hợp với tim mình, rồi hành động bằng sự chân thành.',
    meaning_reversed:
      'Khi đảo ngược, có thể đang tồn tại sự chia tách giữa điều bạn muốn và điều bạn đang làm. Bạn cần làm rõ các giá trị cốt lõi để tránh những quyết định làm sâu thêm lệch hướng.'
  },
  major_07: {
    name_vi: 'Chiến Xa',
    keywords_upright: ['ý chí', 'tiến lên', 'kiểm soát', 'chiến thắng'],
    keywords_reversed: ['mất hướng', 'quá sức', 'xung đột nội tâm', 'chặn lại'],
    meaning_upright:
      'The Chariot cho thấy bạn có thể tiến lên nếu biết hội tụ ý chí và giữ tay lái với hướng đi của mình. Lá bài nhấn mạnh động lực, khả năng tự chủ và sự quyết tâm vượt qua lực kéo trái ngược.',
    meaning_reversed:
      'Ở thế ngược, bạn dễ rơi vào tình trạng bị kéo về nhiều phía và đi rất nhiều nhưng không đến đâu. Điều cần ưu tiên là xác định một mục tiêu rõ, sau đó thu hẹp năng lượng lại.'
  },
  major_08: {
    name_vi: 'Sức Mạnh',
    keywords_upright: ['bình tĩnh', 'kiên nhẫn', 'nội lực', 'cảm hóa'],
    keywords_reversed: ['tự nghi ngờ', 'cạn sức', 'bộc phát', 'mất tự chủ'],
    meaning_upright:
      'Strength là sức mạnh mềm, nơi bạn không cần ép buộc mọi việc mà vẫn có thể hướng dẫn năng lượng theo cách ổn định. Nó khuyên bạn dùng sự dịu dàng, kiên nhẫn và lòng tử tế để làm chủ tình huống.',
    meaning_reversed:
      'Khi đảo ngược, bạn có thể đang mệt vì vừa cố gắng quá mức vừa nghi ngờ khả năng của mình. Hãy quay lại với nhịp thở, sự tự tôn và cách hành động bền bỉ hơn thay vì gắng sức ngắn hạn.'
  },
  major_09: {
    name_vi: 'Ẩn Sĩ',
    keywords_upright: ['chiêm nghiệm', 'dẫn đường', 'nội tâm', 'trí tuệ'],
    keywords_reversed: ['cô lập', 'lảng tránh', 'mất kết nối', 'đóng kín'],
    meaning_upright:
      'The Hermit khuyên bạn tạm lùi một bước để thấy rõ hơn, thay vì tiếp tục lao vào những âm thanh bên ngoài. Đây là giai đoạn tốt để tổng kết, tự học và tìm câu trả lời bên trong mình.',
    meaning_reversed:
      'Ở chiều ngược, sự rút lui có thể đã chuyển thành cô lập và làm bạn khó nghe được phản hồi cần thiết. Hãy giữ không gian riêng, nhưng đừng cắt đứt kết nối với những điều nuôi dưỡng bạn.'
  },
  major_10: {
    name_vi: 'Bánh Xe Số Phận',
    keywords_upright: ['chu kỳ', 'biến chuyển', 'cơ hội', 'vận động'],
    keywords_reversed: ['trì trệ', 'lặp lại', 'ngoan cố', 'cảm giác mất kiểm soát'],
    meaning_upright:
      'Lá bài này nhắc rằng cuộc sống luôn đi theo chu kỳ, và một vòng quay mới đang mở ra. Bạn không kiểm soát tất cả biến số, nhưng có thể đón cơ hội bằng sự linh hoạt và tâm thế sẵn sàng.',
    meaning_reversed:
      'Khi đảo ngược, bạn có thể đang cảm thấy vận may không đứng về phía mình hoặc một khuôn mẫu cũ đang lặp lại. Điều quan trọng là nhận ra bài học của vòng quay này để không bị cuốn đi vô thức.'
  },
  major_11: {
    name_vi: 'Công Lý',
    keywords_upright: ['sự thật', 'cân bằng', 'trách nhiệm', 'nhân quả'],
    keywords_reversed: ['lệch cán cân', 'biện minh', 'thiếu rõ ràng', 'phủ nhận hậu quả'],
    meaning_upright:
      'Justice mời bạn nhìn vào sự thật một cách tỉnh táo và chấp nhận trách nhiệm của mình trong tình huống hiện tại. Lá bài này phù hợp với các quyết định cần công tâm, chuẩn mực và sự rõ ràng trong lý lẽ.',
    meaning_reversed:
      'Ở thế ngược, có thể bạn đang né tránh một kết luận khó nghe hoặc để cảm xúc làm méo cán cân. Hãy quay về với dữ kiện, giới hạn và điều mình có thể chịu trách nhiệm.'
  },
  major_12: {
    name_vi: 'Người Treo Ngược',
    keywords_upright: ['tạm dừng', 'góc nhìn mới', 'buông ra', 'hy sinh'],
    keywords_reversed: ['trì hoãn', 'mắc kẹt', 'chống cự', 'không chịu đổi góc nhìn'],
    meaning_upright:
      'Lá bài này không yêu cầu bạn lao tới, mà mời bạn dừng lại để thấy một sự thật từ góc nhìn khác. Đôi khi tiến triển thật sự đến từ việc buông một cách chấp nhận, không phải từ việc cố thêm nữa.',
    meaning_reversed:
      'Khi đảo ngược, sự tạm dừng có thể đã trở thành đình trệ kéo dài vì bạn chưa sẵn sàng thay đổi cách nhìn. Bạn cần xác định điều gì đang giữ chân mình trong một vòng lặp không cần thiết.'
  },
  major_13: {
    name_vi: 'Tử Thần',
    keywords_upright: ['kết thúc', 'chuyển hóa', 'bước sang chu kỳ mới', 'cắt bỏ'],
    keywords_reversed: ['bám víu', 'ngại đổi thay', 'kéo dài', 'chưa buông'],
    meaning_upright:
      'Death hiếm khi nói về một mất mát theo nghĩa đen, mà chủ yếu nói về sự kết thúc cần thiết để mở ra một hình thái mới. Nó nhắc bạn rằng việc buông bỏ có thể đau, nhưng cũng giải phóng năng lượng sống.',
    meaning_reversed:
      'Ở chiều ngược, bạn có thể đang cố neo vào điều đã hết vòng đời của nó. Việc đổi thay vẫn sẽ đến, nhưng bạn sẽ nhẹ hơn nếu chủ động đóng một cánh cửa cũ.'
  },
  major_14: {
    name_vi: 'Điều Độ',
    keywords_upright: ['dung hòa', 'tiết chế', 'cân bằng', 'phối hợp'],
    keywords_reversed: ['quá tay', 'lệch nhịp', 'mất cân đối', 'khó hòa hợp'],
    meaning_upright:
      'Temperance là nghệ thuật pha trộn đúng tỷ lệ để tạo ra sự ôn hòa lâu dài. Nó khuyên bạn điều chỉnh nhịp độ, kết nối các mặt đối lập và tìm cách đi bền vững thay vì cực đoan.',
    meaning_reversed:
      'Khi đảo ngược, cuộc sống có thể đang lệch nhịp vì một mặt nào đó bị đẩy quá xa. Hãy trở lại với sự vừa đủ, sắp xếp ưu tiên và nhìn xem chỗ nào cần được cân lại.'
  },
  major_15: {
    name_vi: 'Ác Quỷ',
    keywords_upright: ['ràng buộc', 'cám dỗ', 'chấp niệm', 'vật chất'],
    keywords_reversed: ['gỡ bỏ xiềng xích', 'nhận diện bóng tối', 'giải phóng', 'thu hồi quyền lực'],
    meaning_upright:
      'The Devil cho thấy một liên kết đang trở nên quá chặt, có thể là thói quen, ham muốn, nỗi sợ hay kiểu suy nghĩ làm bạn mất tự do. Lá bài này không nhằm đe dọa, mà để chỉ ra nơi bạn đang trao quyền lực của mình cho một điều khác.',
    meaning_reversed:
      'Ở thế ngược, bạn bắt đầu nhìn ra bản chất của ràng buộc và có cơ hội cắt nó lỏng dần. Quá trình này đòi hỏi sự thật lòng và kỷ luật nhỏ, nhưng nó mở ra đường lui rõ ràng hơn.'
  },
  major_16: {
    name_vi: 'Tòa Tháp',
    keywords_upright: ['phá vỡ', 'thức tỉnh', 'biến cố', 'giải phóng'],
    keywords_reversed: ['càng giữ càng vỡ', 'chấn động âm ỉ', 'trì hoãn sự thật', 'hạ cánh khó'],
    meaning_upright:
      'Tòa Tháp là sự sụp đổ của cấu trúc không còn vững, để sự thật có chỗ xuất hiện. Đúng là nó gây sốc, nhưng nó cũng cắt đứt ảo tưởng và buộc bạn đứng trên nền tảng thật hơn.',
    meaning_reversed:
      'Khi đảo ngược, sự biến chuyển vẫn đang diễn ra nhưng có thể theo cách âm ỉ hoặc bị trì hoãn vì bạn đang cố thủ giữ nguyên hiện trạng. Càng sớm chấp nhận điều cần thay, quá trình càng bớt tổn hao.'
  },
  major_17: {
    name_vi: 'Ngôi Sao',
    keywords_upright: ['hy vọng', 'chữa lành', 'truyền cảm hứng', 'tin tưởng'],
    keywords_reversed: ['mất niềm tin', 'kiệt quệ', 'nghi ngờ', 'thiếu kết nối'],
    meaning_upright:
      'The Star đem lại một luồng khí trong, nhắc bạn rằng sau biến động vẫn có chỗ cho niềm tin và sự phục hồi. Nó khuyên bạn mở lòng, nói thật và tiếp tục đi theo ánh sáng nhỏ mà bền bỉ.',
    meaning_reversed:
      'Ở chiều ngược, ngọn đèn hy vọng có thể đang mờ đi do mệt mỏi hoặc thất vọng. Bạn không cần ép mình lạc quan ngay, nhưng cần tìm lại một nguồn nuôi dưỡng nhỏ và đều.'
  },
  major_18: {
    name_vi: 'Mặt Trăng',
    keywords_upright: ['mơ hồ', 'tiềm thức', 'nỗi sợ', 'trực giác'],
    keywords_reversed: ['lộ diện', 'rõ hơn', 'thoát ảo ảnh', 'giảm rối'],
    meaning_upright:
      'The Moon xuất hiện khi con đường trước mắt chưa rõ, cảm xúc lên xuống và tiếp cận bằng lý trí đơn thuần là chưa đủ. Lá bài này mời bạn đi chậm, để ý giấc mơ, linh cảm và những kiểu sợ hãi đang thao túng hành vi.',
    meaning_reversed:
      'Khi đảo ngược, sự mơ hồ dần tan và một vài điều ẩn dưới mặt nước bắt đầu lộ ra. Đây là lúc để tách cảm giác khó chịu thành thông tin cụ thể, từ đó lấy lại sự rõ ràng.'
  },
  major_19: {
    name_vi: 'Mặt Trời',
    keywords_upright: ['rõ ràng', 'niềm vui', 'thành công', 'sức sống'],
    keywords_reversed: ['trễ nhịp', 'quá tự tin', 'bị che mờ', 'mất năng lượng'],
    meaning_upright:
      'The Sun là sự ấm áp, minh bạch và niềm vui được phơi sáng rõ ràng. Nó cho thấy một giai đoạn tốt để nói ra, toàn tâm sống với điều tốt đẹp và để những kết quả rõ ràng xuất hiện.',
    meaning_reversed:
      'Ở thế ngược, ánh sáng vẫn còn đó nhưng có thể bị một lớp mây tạm thời che bớt. Bạn cần bỏ những kỳ vọng quá cao hoặc sự mệt mỏi đang ngăn mình tận hưởng thành quả hiện có.'
  },
  major_20: {
    name_vi: 'Phán Xét',
    keywords_upright: ['thức tỉnh', 'tổng kết', 'tha thứ', 'tái sinh'],
    keywords_reversed: ['trì hoãn thức tỉnh', 'tự phán xét', 'chưa khớp bài học', 'bỏ lỡ tiếng gọi'],
    meaning_upright:
      'Judgement là tiếng kèn gọi bạn nhìn lại một chu kỳ lớn và đứng dậy với phiên bản trưởng thành hơn của mình. Nó phù hợp với các quyết định mang tính tổng kết, giải phóng và bước sang giai đoạn mới.',
    meaning_reversed:
      'Khi đảo ngược, bạn có thể đang tự phán xét quá tay hoặc trì hoãn một quyết định đã rõ. Hãy dùng sự thật và lòng bao dung để đóng lại điều cần khép lại.'
  },
  major_21: {
    name_vi: 'Thế Giới',
    keywords_upright: ['hoàn tất', 'viên mãn', 'kết nối', 'trưởng thành'],
    keywords_reversed: ['chưa trọn vẹn', 'trì hoãn đích đến', 'bỏ dở dang dở', 'thiếu khớp nối'],
    meaning_upright:
      'The World đánh dấu một chu kỳ đã được hoàn thành và một tầm nhìn tổng thể đã kết nối thành hình. Nó mang cảm giác đầy đủ, khớp nối và sẵn sàng cho vòng mới từ một vị trí vững vàng hơn.',
    meaning_reversed:
      'Ở chiều ngược, bạn có thể đang rất gần đích nhưng còn một vài nút chưa thắt lại. Hãy hoàn thành nốt điều đang dang dở, thay vì bỏ qua giai đoạn kết lại quan trọng.'
  }
};

const suitConfigs = {
  wands: {
    suit: 'wands',
    suit_vi: 'Gậy',
    element: 'Fire',
    accent: '#d07a43',
    noun: 'Gậy',
    domain: 'đam mê, sáng tạo và hành động',
    uprightBase:
      'Lá này mang năng lượng của lửa, thúc đẩy bạn hành động, thử nghiệm và khơi dậy động lực bên trong.',
    reversedBase:
      'Khi đảo ngược, năng lượng lửa này dễ trở nên nóng vội, mất định hướng hoặc kiệt sức vì phân tán quá nhiều hướng.'
  },
  cups: {
    suit: 'cups',
    suit_vi: 'Chén',
    element: 'Water',
    accent: '#5f93c9',
    noun: 'Chén',
    domain: 'cảm xúc, kết nối và trực giác',
    uprightBase:
      'Lá này nói về dòng chảy cảm xúc, sự liên kết và cách bạn tiếp nhận thế giới bằng trái tim và trực giác.',
    reversedBase:
      'Khi đảo ngược, dòng nước cảm xúc này có thể đang bị ùn tắc, tràn bờ hoặc khó được gọi tên một cách rõ ràng.'
  },
  swords: {
    suit: 'swords',
    suit_vi: 'Kiếm',
    element: 'Air',
    accent: '#93b5d0',
    noun: 'Kiếm',
    domain: 'tư duy, sự thật và xung đột',
    uprightBase:
      'Lá này mang năng lượng của không khí, liên quan đến cách bạn suy nghĩ, nhìn vấn đề và cắt nghĩa sự thật.',
    reversedBase:
      'Khi đảo ngược, năng lượng trí óc này dễ bị rối, căng thẳng, tự bào chữa hoặc kết luận sai lệch.'
  },
  pentacles: {
    suit: 'pentacles',
    suit_vi: 'Tiền',
    element: 'Earth',
    accent: '#78a55a',
    noun: 'Tiền',
    domain: 'công việc, tài nguyên và tính thực tế',
    uprightBase:
      'Lá này đại diện cho đất, tiến độ cụ thể, những thứ có thể xây dựng, chăm sóc và giữ cho bền vững.',
    reversedBase:
      'Khi đảo ngược, vấn đề thực tế dễ rơi vào trì trệ, bất cẩn hoặc quá chấp vào sự an toàn bề ngoài.'
  }
};

const rankDefinitions = [
  {
    rank: 'Ace',
    number: 1,
    namePrefix: 'Ace of',
    nameViPrefix: 'Át',
    upright: 'Mở ra một cơ hội mới và một nguồn năng lượng nguyên sơ để bắt đầu.',
    reversed: 'Cơ hội vẫn có nhưng dễ bị bỏ lỡ, chậm nhịp hoặc chưa được đón nhận đúng lúc.',
    upKeywords: ['cơ hội', 'khởi đầu', 'hạt giống', 'tiềm năng'],
    revKeywords: ['bỏ lỡ', 'chậm nhịp', 'nghi ngờ', 'đóng lại']
  },
  {
    rank: 'Two',
    number: 2,
    namePrefix: 'Two of',
    nameViPrefix: 'Hai',
    upright: 'Tập trung vào cân đối, lựa chọn và cách hai lực kéo đang đối thoại với nhau.',
    reversed: 'Cần cảnh báo sự lúng túng, treo quyết định hoặc lệch mất cân bằng giữa hai hướng.',
    upKeywords: ['cân bằng', 'lựa chọn', 'đối thoại', 'cân đối'],
    revKeywords: ['bế tắc', 'do dự', 'lệch cân', 'khó chọn']
  },
  {
    rank: 'Three',
    number: 3,
    namePrefix: 'Three of',
    nameViPrefix: 'Ba',
    upright: 'Năng lượng ba thường liên quan đến mở rộng, phối hợp và thấy kết quả đầu tiên đang hình thành.',
    reversed: 'Bạn có thể đang gặp trở ngại trong phối hợp hoặc dự án mở ra nhưng chưa đi đến đâu.',
    upKeywords: ['mở rộng', 'phối hợp', 'tầm nhìn', 'bắt đầu có kết quả'],
    revKeywords: ['trở ngại', 'rời rạc', 'chậm tiến', 'lệch hướng']
  },
  {
    rank: 'Four',
    number: 4,
    namePrefix: 'Four of',
    nameViPrefix: 'Bốn',
    upright: 'Lá bài đưa năng lượng về ổn định, nề nếp và một nền tảng để bạn đứng chân lâu hơn.',
    reversed: 'Khi đảo ngược, sự ổn định này có thể bị lung lay hoặc trở thành quá đóng khiến năng lượng không luân chuyển.',
    upKeywords: ['ổn định', 'nền tảng', 'giữ nhịp', 'nề nếp'],
    revKeywords: ['lung lay', 'đóng cứng', 'thiếu linh hoạt', 'bất an']
  },
  {
    rank: 'Five',
    number: 5,
    namePrefix: 'Five of',
    nameViPrefix: 'Năm',
    upright: 'Năm là pha dao động, xung đột nhỏ hoặc sự thay đổi buộc bạn phải điều chỉnh nhanh.',
    reversed: 'Ở chiều ngược, xung đột có thể đang dịu lại, bị né tránh hoặc chuyển thành căng thẳng ngầm.',
    upKeywords: ['thay đổi', 'xung đột', 'căng co', 'thích nghi'],
    revKeywords: ['né tránh', 'giảm căng', 'âm ỉ', 'sửa lại']
  },
  {
    rank: 'Six',
    number: 6,
    namePrefix: 'Six of',
    nameViPrefix: 'Sáu',
    upright: 'Sáu thường đem đến sự hài hòa hơn, một nhịp chuyển tiếp dễ dàng hoặc cảm giác được nâng đỡ.',
    reversed: 'Khi đảo ngược, dòng chảy dễ bị chậm lại, mất cân đối hoặc có sự lệch giữa cho và nhận.',
    upKeywords: ['hài hòa', 'nâng đỡ', 'chuyển tiếp', 'dễ thở hơn'],
    revKeywords: ['mất cân', 'kéo lại', 'không đều', 'lệch đôi']
  },
  {
    rank: 'Seven',
    number: 7,
    namePrefix: 'Seven of',
    nameViPrefix: 'Bảy',
    upright: 'Bảy gợi đến bài kiểm tra về niềm tin, chiến lược và khả năng giữ hướng khi áp lực tăng lên.',
    reversed: 'Ở thế ngược, bạn có thể mệt mỏi, phân vân hoặc dùng sai cách để bảo vệ điều quan trọng.',
    upKeywords: ['thử thách', 'giữ hướng', 'chiến lược', 'niềm tin'],
    revKeywords: ['mệt mỏi', 'lung lay', 'do dự', 'mất thế']
  },
  {
    rank: 'Eight',
    number: 8,
    namePrefix: 'Eight of',
    nameViPrefix: 'Tám',
    upright: 'Tám là năng lượng của dòng chảy rõ hơn, tốc độ cao hơn hoặc sự lặp lại giúp tạo thành kỹ năng.',
    reversed: 'Khi đảo ngược, nhịp độ dễ bị đứt, trễ hoặc lặp lại một cách vô thức mà không tạo tiến bộ.',
    upKeywords: ['tiến triển', 'nhịp độ', 'động lực', 'lặp lại có ý thức'],
    revKeywords: ['trì trệ', 'mất nhịp', 'lặp lại vô thức', 'trễ']
  },
  {
    rank: 'Nine',
    number: 9,
    namePrefix: 'Nine of',
    nameViPrefix: 'Chín',
    upright: 'Chín là mức sát đích, nơi bạn có kinh nghiệm và cần thêm sự bền bỉ để kết chu kỳ hiện tại.',
    reversed: 'Ở chiều ngược, cảm giác gần đích có thể đi kèm cạn sức, lo âu hoặc khó buông sự phòng thủ.',
    upKeywords: ['gần đích', 'kinh nghiệm', 'bền bỉ', 'cán đích'],
    revKeywords: ['cạn sức', 'lo âu', 'phòng thủ', 'khó buông']
  },
  {
    rank: 'Ten',
    number: 10,
    namePrefix: 'Ten of',
    nameViPrefix: 'Mười',
    upright: 'Mười đánh dấu điểm đầy của chu kỳ, nơi kết quả rõ hơn nhưng cũng cho thấy gánh nặng hoặc hệ quả của nó.',
    reversed: 'Khi đảo ngược, chu kỳ này đang đòi được giải tải, đóng lại hoặc sắp xếp lại cho bền vững hơn.',
    upKeywords: ['đầy chu kỳ', 'kết quả', 'hoàn tất', 'gánh nặng rõ hơn'],
    revKeywords: ['giải tải', 'sắp xếp lại', 'buông bớt', 'hệ quả']
  },
  {
    rank: 'Page',
    number: 11,
    namePrefix: 'Page of',
    nameViPrefix: 'Tiểu Đồng',
    upright: 'Page đem đến tâm thế học hỏi, tín hiệu mới và sự mở của người đang bước vào một lĩnh vực bằng trí tò mò.',
    reversed: 'Ở thế ngược, sự non trẻ hoặc phân tâm có thể khiến thông điệp đẹp trở nên méo hoặc khó giữ định hướng.',
    upKeywords: ['học hỏi', 'tín hiệu mới', 'tò mò', 'mở cửa'],
    revKeywords: ['non trẻ', 'phân tâm', 'dở chừng', 'thiếu định hướng']
  },
  {
    rank: 'Knight',
    number: 12,
    namePrefix: 'Knight of',
    nameViPrefix: 'Kỵ Sĩ',
    upright: 'Knight đẩy câu chuyện đi nhanh hơn, nhiều động lực hơn và đòi hỏi bạn đưa năng lượng vào hành động có hướng.',
    reversed: 'Khi đảo ngược, động lực này dễ trở nên hấp tấp, mất kiểm soát hoặc chạy quá đà trong khi mục tiêu chưa rõ.',
    upKeywords: ['hành động', 'động lực', 'thế tiến', 'xông lên'],
    revKeywords: ['hấp tấp', 'quá đà', 'mất hướng', 'thiếu điều tiết']
  },
  {
    rank: 'Queen',
    number: 13,
    namePrefix: 'Queen of',
    nameViPrefix: 'Nữ Hoàng',
    upright: 'Queen là năng lượng trưởng thành, biết quan sát và điều hướng lĩnh vực này bằng sự tinh tế và nội lực ổn định.',
    reversed: 'Ở thế ngược, năng lượng này có thể bị lệch thành nhạy cảm quá mức, kiểm soát ngầm hoặc mất cân đối nội tâm.',
    upKeywords: ['trưởng thành', 'nội lực', 'tinh tế', 'điều hướng'],
    revKeywords: ['quá nhạy', 'kiểm soát ngầm', 'lệch cân', 'tự đóng']
  },
  {
    rank: 'King',
    number: 14,
    namePrefix: 'King of',
    nameViPrefix: 'Quốc Vương',
    upright: 'King thể hiện mức độ làm chủ cao nhất của lĩnh vực này, nơi kinh nghiệm và thẩm quyền đi kèm trách nhiệm rõ ràng.',
    reversed: 'Khi đảo ngược, cách làm chủ dễ chuyển thành cứng nhắc, quá ưu thế hoặc mất sự điềm đạm cần thiết.',
    upKeywords: ['làm chủ', 'thẩm quyền', 'kinh nghiệm', 'trách nhiệm'],
    revKeywords: ['cứng nhắc', 'quá ưu thế', 'lệch dùng quyền', 'thiếu lắng nghe']
  }
];

function titleCaseSuit(suit) {
  return suit.charAt(0).toUpperCase() + suit.slice(1);
}

function createMinorCard(suitKey, definition) {
  const suit = suitConfigs[suitKey];
  const idNumber = String(definition.number).padStart(2, '0');

  return {
    id: `${suit.suit}_${idNumber}`,
    name: `${definition.namePrefix} ${titleCaseSuit(suit.suit)}`,
    name_vi: `${definition.nameViPrefix} ${suit.noun}`,
    arcana: 'minor',
    suit: suit.suit,
    suit_vi: suit.suit_vi,
    number: definition.number,
    rank: definition.rank,
    element: suit.element,
    accent: suit.accent,
    keywords_upright: definition.upKeywords,
    keywords_reversed: definition.revKeywords,
    meaning_upright: `${suit.uprightBase} ${definition.upright} Trong bộ ${suit.suit_vi.toLowerCase()}, lá này thường liên quan đến ${suit.domain} và cách bạn đưa năng lượng đó vào đời sống.`,
    meaning_reversed: `${suit.reversedBase} ${definition.reversed} Đây là lời nhắc để điều chỉnh nhịp độ, cách ưu tiên và cách bạn đang đẩy hoặc giữ năng lượng này trong mình.`,
    image: `assets/cards/${suit.suit}_${idNumber}.webp`
  };
}

const majorCards = currentPayload.cards
  .filter((card) => card.arcana === 'major')
  .sort((left, right) => left.number - right.number)
  .map((card) => {
    const translation = majorTranslations[card.id];

    if (!translation) {
      throw new Error(`Missing translation for ${card.id}`);
    }

    return {
      ...card,
      name_vi: translation.name_vi,
      keywords_upright: translation.keywords_upright,
      keywords_reversed: translation.keywords_reversed,
      meaning_upright: translation.meaning_upright,
      meaning_reversed: translation.meaning_reversed
    };
  });

const minorCards = Object.keys(suitConfigs).flatMap((suitKey) =>
  rankDefinitions.map((definition) => createMinorCard(suitKey, definition))
);

const cards = [...majorCards, ...minorCards];

const payload = {
  meta: {
    version: 1,
    language: 'vi',
    card_count: cards.length,
    major_count: 22,
    minor_count: 56,
    suits: ['wands', 'cups', 'swords', 'pentacles']
  },
  cards
};

await writeFile(dataPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Regenerated tarot data with ${cards.length} cards.`);
