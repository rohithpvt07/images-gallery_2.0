import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Search from './components/Search';
import ImageCard from './components/ImageCard';
import Welcome from './components/Welcome';
import Spinner from './components/Spinner';
import { Container, Row, Col } from 'react-bootstrap';

const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

const App = () => {
  const [word, setWord] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Search Unsplash images
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!word) return toast.warning('Please enter a search term');
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?query=${word}&client_id=${ACCESS_KEY}`
      );
      if (res.data.results.length === 0) {
        toast.info('No images found.');
      } else {
        setImages(res.data.results);
        toast.success(`Found ${res.data.results.length} images for "${word}"`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch images. Check your Unsplash key.');
    }
    setWord('');
    setLoading(false);
  };

  // 💾 Save image (local only)
  const handleSaveImage = (id) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, saved: true } : img
    );
    setImages(updated);
    const img = images.find((i) => i.id === id);
    toast.success(`Saved "${img?.alt_description || 'image'}"`);
  };

  // 🗑️ Delete image (local only)
  const handleDeleteImage = (id) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    toast.warn('Image deleted');
  };

  return (
    <div>
      <Header title="Images Gallery" />
      <Search word={word} setWord={setWord} handleSubmit={handleSearchSubmit} />

      <Container className="mt-4">
        {loading ? (
          <Spinner />
        ) : images.length ? (
          <Row xs={1} md={2} lg={3}>
            {images.map((image, i) => (
              <Col key={i} className="pb-3">
                <ImageCard
                  image={image}
                  saveImage={handleSaveImage}
                  deleteImage={handleDeleteImage}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Welcome />
        )}
      </Container>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;
