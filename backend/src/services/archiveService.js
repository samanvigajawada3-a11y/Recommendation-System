const axios = require("axios");

const ARCHIVE_SEARCH_URL = "https://archive.org/advancedsearch.php";

const normalizeArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const fetchArchiveMovies = async (rows = 36) => {
  const { data } = await axios.get(ARCHIVE_SEARCH_URL, {
    params: {
      q: "collection:(feature_films) AND mediatype:(movies)",
      fl: ["identifier", "title", "description", "date", "subject"].join(","),
      rows,
      page: 1,
      output: "json",
      sort: "downloads desc"
    }
  });

  return data.response.docs
    .filter((item) => item.identifier && item.title)
    .map((item) => {
      const genres = normalizeArray(item.subject)
        .map((subject) => String(subject).trim())
        .filter(Boolean)
        .slice(0, 5);

      return {
        archiveId: item.identifier,
        title: item.title,
        description: String(item.description || "A public-domain film from the Internet Archive.").slice(0, 900),
        posterUrl: `https://archive.org/services/img/${item.identifier}`,
        watchUrl: `https://archive.org/embed/${item.identifier}`,
        year: item.date ? String(item.date).slice(0, 4) : "",
        genres
      };
    });
};

module.exports = { fetchArchiveMovies };
