const express = require('express');
const cors = require('cors');
const { ANIME } = require('@consumet/extensions');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// استخدام Gogoanime لأنه المزود الأكثر استقراراً وثباتاً داخل المكتبة
const animeProvider = new ANIME.Gogoanime();

// 1. الصفحة الرئيسية للتأكد من عمل السيرفر
app.get('/', (req, res) => {
  res.send({ status: 'online', message: 'Anime Backend API is running successfully!' });
});

// 2. مسار البحث (يحافظ على نفس اسم المسار الذي يطلبه موقعك)
app.get('/anime/hiAnime/search', async (req, res) => {
  try {
    const query = req.query.keywords || req.query.q;
    if (!query) return res.status(400).json({ error: 'Keywords required' });

    const results = await animeProvider.search(query);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

// 3. مسار جلب تفاصيل الأنمي والحلقات
app.get('/anime/hiAnime/info', async (req, res) => {
  try {
    const animeId = req.query.animeId || req.query.id;
    if (!animeId) return res.status(400).json({ error: 'Anime ID required' });

    const info = await animeProvider.fetchAnimeInfo(animeId);
    res.json(info);
  } catch (error) {
    console.error('Info error:', error);
    res.status(500).json({ error: 'Failed to fetch anime info' });
  }
});

// 4. مسار جلب روابط بث الحلقة (.m3u8)
app.get('/anime/hiAnime/watch', async (req, res) => {
  try {
    const episodeId = req.query.episodeId;
    if (!episodeId) return res.status(400).json({ error: 'Episode ID required' });

    const sources = await animeProvider.fetchEpisodeSources(episodeId);
    res.json(sources);
  } catch (error) {
    console.error('Watch error:', error);
    res.status(500).json({ error: 'Failed to fetch episode sources' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
