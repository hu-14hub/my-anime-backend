import express from 'express';
import cors from 'cors';
import { ANIME } from '@consumet/extensions';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const animeProvider = new ANIME.GogoAnime();

app.get('/', (req, res) => {
  res.send({ status: 'online', message: 'Anime Backend API is running successfully!' });
});

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
