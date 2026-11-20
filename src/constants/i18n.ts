import type { AppLanguage } from '../types/music';

export interface Translations {
  appTagline: string;
  menuProfile: string;
  menuTheme: string;
  menuSettings: string;
  menuLock: string;
  menuSounds: string;
  importFiles: string;
  importFolder: string;
  newPlaylist: string;
  searchPlaceholder: string;
  tabAll: string;
  tabLossless: string;
  tabFavorites: string;
  tabPlaylists: string;
  noTracksTitle: string;
  noTracksSubtitle: string;
  loadSampleWav: string;
  dropHint: string;
  nowPlaying: string;
  lyricsTab: string;
  queueTab: string;
  eqTab: string;
  detectLyricsAI: string;
  retranslateAI: string;
  analyzingAI: string;
  moodSync: string;
  floatingPlayer: string;
  shareAppLink: string;
  linkCopied: string;
  editTrack: string;
  renamePlaylist: string;
  changeCover: string;
  save: string;
  cancel: string;
  delete: string;
  addToPlaylist: string;
  sleepTimer: string;
  speed: string;
  off: string;
  songsCount: string;
  playlistsCount: string;
  losslessCount: string;
  playsCount: string;
}

export const UI_TEXT: Record<AppLanguage, Translations> = {
  es: {
    appTagline: 'Audio sin pérdida',
    menuProfile: 'Perfil',
    menuTheme: 'Tema',
    menuSettings: 'Ajustes',
    menuLock: 'Clave de pantalla',
    menuSounds: 'Sonidos ASMR',
    importFiles: 'Agregar audio',
    importFolder: 'Carpeta',
    newPlaylist: 'Nueva lista',
    searchPlaceholder: 'Buscar canción, artista o formato…',
    tabAll: 'Todas',
    tabLossless: 'Sin pérdida',
    tabFavorites: 'Favoritas',
    tabPlaylists: 'Listas',
    noTracksTitle: 'Tu rincón musical está listo',
    noTracksSubtitle:
      'Importa tus archivos FLAC, WAV, ALAC, MP3 o M4A desde tu dispositivo, o carga las pistas WAV de muestra.',
    loadSampleWav: 'Cargar pistas WAV de muestra',
    dropHint: 'Suelta archivos de audio aquí',
    nowPlaying: 'Reproduciendo',
    lyricsTab: 'Letra',
    queueTab: 'Cola',
    eqTab: 'Ecualizador',
    detectLyricsAI: 'Detectar y traducir letra',
    retranslateAI: 'Traducir a este idioma',
    analyzingAI: 'Escuchando y traduciendo…',
    moodSync: 'Sincronizar ánimo',
    floatingPlayer: 'Sobre otras apps',
    shareAppLink: 'Compartir enlace',
    linkCopied: 'Enlace copiado',
    editTrack: 'Editar canción y portada',
    renamePlaylist: 'Renombrar lista',
    changeCover: 'Elegir foto de galería',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    addToPlaylist: 'Añadir a lista',
    sleepTimer: 'Temporizador',
    speed: 'Velocidad',
    off: 'Apagado',
    songsCount: 'Canciones',
    playlistsCount: 'Listas',
    losslessCount: 'Sin pérdida',
    playsCount: 'Escuchas',
  },
  en: {
    appTagline: 'Lossless audio',
    menuProfile: 'Profile',
    menuTheme: 'Theme',
    menuSettings: 'Settings',
    menuLock: 'Screen lock',
    menuSounds: 'ASMR sounds',
    importFiles: 'Add audio',
    importFolder: 'Folder',
    newPlaylist: 'New playlist',
    searchPlaceholder: 'Search track, artist, or format…',
    tabAll: 'All',
    tabLossless: 'Lossless',
    tabFavorites: 'Favorites',
    tabPlaylists: 'Playlists',
    noTracksTitle: 'Your music corner is ready',
    noTracksSubtitle:
      'Import local FLAC, WAV, ALAC, MP3, or M4A audio files from your device, or load sample lossless WAV tracks.',
    loadSampleWav: 'Load sample WAV tracks',
    dropHint: 'Drop audio files here',
    nowPlaying: 'Now Playing',
    lyricsTab: 'Lyrics',
    queueTab: 'Queue',
    eqTab: 'Equalizer',
    detectLyricsAI: 'Detect & translate lyrics',
    retranslateAI: 'Translate to this language',
    analyzingAI: 'Listening & translating…',
    moodSync: 'Mood sync',
    floatingPlayer: 'Float over apps',
    shareAppLink: 'Share link',
    linkCopied: 'Link copied',
    editTrack: 'Edit song & cover',
    renamePlaylist: 'Rename playlist',
    changeCover: 'Choose from gallery',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    addToPlaylist: 'Add to playlist',
    sleepTimer: 'Sleep timer',
    speed: 'Speed',
    off: 'Off',
    songsCount: 'Tracks',
    playlistsCount: 'Playlists',
    losslessCount: 'Lossless',
    playsCount: 'Plays',
  },
  zh: {
    appTagline: '无损音乐与AI歌词',
    menuProfile: '个人主页',
    menuTheme: '主题装扮',
    menuSettings: '设置',
    menuLock: '锁屏密码',
    menuSounds: 'ASMR 按键音',
    importFiles: '导入音频',
    importFolder: '文件夹',
    newPlaylist: '新建歌单',
    searchPlaceholder: '搜索歌曲、歌手或无损格式…',
    tabAll: '全部',
    tabLossless: '无损音质',
    tabFavorites: '我喜欢',
    tabPlaylists: '歌单',
    noTracksTitle: '你的音乐小窝已准备好',
    noTracksSubtitle: '导入本地 FLAC、WAV、ALAC、MP3 或 M4A 文件，或加载示例无损 WAV 曲目。',
    loadSampleWav: '加载示例 WAV 曲目',
    dropHint: '拖放音频文件到此处',
    nowPlaying: '正在播放',
    lyricsTab: 'AI 歌词',
    queueTab: '播放列表',
    eqTab: '均衡器',
    detectLyricsAI: 'AI 识别并翻译歌词',
    retranslateAI: '翻译为当前语言',
    analyzingAI: '正在聆听并翻译…',
    moodSync: '情绪同步氛围',
    floatingPlayer: '悬浮播放',
    shareAppLink: '分享链接',
    linkCopied: '链接已复制',
    editTrack: '编辑歌曲与封面',
    renamePlaylist: '重命名歌单',
    changeCover: '从相册选择封面',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    addToPlaylist: '添加到歌单',
    sleepTimer: '定时关闭',
    speed: '倍速',
    off: '关闭',
    songsCount: '歌曲',
    playlistsCount: '歌单',
    losslessCount: '无损',
    playsCount: '播放',
  },
  ja: {
    appTagline: 'ロスレス音楽＆AI歌詞',
    menuProfile: 'プロフィール',
    menuTheme: 'テーマ',
    menuSettings: '設定',
    menuLock: '画面ロック',
    menuSounds: 'ASMR サウンド',
    importFiles: '曲を追加',
    importFolder: 'フォルダ',
    newPlaylist: '新規リスト',
    searchPlaceholder: '曲名・アーティスト・形式を検索…',
    tabAll: 'すべて',
    tabLossless: 'ロスレス',
    tabFavorites: 'お気に入り',
    tabPlaylists: 'プレイリスト',
    noTracksTitle: '音楽スペースの準備ができました',
    noTracksSubtitle: 'FLAC、WAV、ALAC、MP3 ファイルを読み込むか、サンプルWAVを再生できます。',
    loadSampleWav: 'サンプルWAVを読み込む',
    dropHint: 'ここにオーディオをドロップ',
    nowPlaying: '再生中',
    lyricsTab: 'AI歌詞',
    queueTab: 'キュー',
    eqTab: 'イコライザー',
    detectLyricsAI: 'AIで歌詞を検出・翻訳',
    retranslateAI: 'この言語に翻訳',
    analyzingAI: '音声を解析中…',
    moodSync: 'ムード連動',
    floatingPlayer: 'フローティング再生',
    shareAppLink: 'リンクを共有',
    linkCopied: 'コピーしました',
    editTrack: '曲名とカバーを編集',
    renamePlaylist: 'リスト名を変更',
    changeCover: 'ギャラリーから選択',
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    addToPlaylist: 'リストに追加',
    sleepTimer: 'スリープタイマー',
    speed: '再生速度',
    off: 'オフ',
    songsCount: '曲',
    playlistsCount: 'リスト',
    losslessCount: 'ロスレス',
    playsCount: '再生回数',
  },
  ko: {
    appTagline: '무손실 오디오 & AI 가사',
    menuProfile: '프로필',
    menuTheme: '테마',
    menuSettings: '설정',
    menuLock: '화면 잠금',
    menuSounds: 'ASMR 사운드',
    importFiles: '음악 추가',
    importFolder: '폴더',
    newPlaylist: '새 재생목록',
    searchPlaceholder: '곡, 아티스트 또는 포맷 검색…',
    tabAll: '전체',
    tabLossless: '무손실',
    tabFavorites: '좋아요',
    tabPlaylists: '재생목록',
    noTracksTitle: '나만의 음악 공간이 준비되었어요',
    noTracksSubtitle: '기기의 FLAC, WAV, ALAC, MP3 파일을 불러오거나 샘플 WAV를 감상하세요.',
    loadSampleWav: '샘플 WAV 불러오기',
    dropHint: '여기에 오디오 파일 놓기',
    nowPlaying: '재생 중',
    lyricsTab: 'AI 가사',
    queueTab: '재생 대기열',
    eqTab: '이퀄라이저',
    detectLyricsAI: 'AI 가사 감지 및 번역',
    retranslateAI: '현재 언어로 번역',
    analyzingAI: '듣고 번역하는 중…',
    moodSync: '분위기 동기화',
    floatingPlayer: '다른 앱 위에 표시',
    shareAppLink: '링크 공유',
    linkCopied: '링크 복사됨',
    editTrack: '곡 및 커버 편집',
    renamePlaylist: '재생목록 이름 변경',
    changeCover: '갤러리에서 선택',
    save: '저장',
    cancel: '취소',
    delete: '삭제',
    addToPlaylist: '재생목록에 추가',
    sleepTimer: '취침 타이머',
    speed: '배속',
    off: '끔',
    songsCount: '곡',
    playlistsCount: '재생목록',
    losslessCount: '무손실',
    playsCount: '재생',
  },
};

export const LANGUAGE_OPTIONS: Array<{ id: AppLanguage; label: string }> = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
  { id: 'zh', label: '中文' },
  { id: 'ja', label: '日本語' },
  { id: 'ko', label: '한국어' },
];
