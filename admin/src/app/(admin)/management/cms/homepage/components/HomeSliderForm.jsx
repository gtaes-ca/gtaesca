import { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import {
  MAX_CMS_IMAGE_BYTES,
  SLIDER_DESKTOP_RATIO,
  SLIDER_MOBILE_RATIO,
  mapSlidesForSave,
  mapSlidesFromApi,
} from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

async function uploadSlideImage(dataUrl, key) {
  const res = await httpClient.post('/api/admin/web-content/upload-image', { dataUrl, key });
  return res.data.url;
}

function BackgroundPreview({ label, imageUrl, aspectRatio }) {
  return (
    <div>
      <p className="small text-muted mb-2">{label}</p>
      <div
        className="position-relative border rounded overflow-hidden bg-dark"
        style={{ aspectRatio, maxWidth: 280 }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
          />
        ) : (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-muted small px-2 text-center">
            No image selected
          </div>
        )}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(90deg, rgba(18,18,18,0.88) 0%, rgba(18,18,18,0.35) 100%)',
          }}
        />
      </div>
    </div>
  );
}

function SlidePreview({ slide }) {
  return (
    <Row className="g-3 mb-1">
      <Col sm={6}>
        <BackgroundPreview
          label="Desktop preview (landscape)"
          imageUrl={slide.backgroundImagePreview}
          aspectRatio={SLIDER_DESKTOP_RATIO}
        />
      </Col>
      <Col sm={6}>
        <BackgroundPreview
          label="Mobile preview (portrait)"
          imageUrl={slide.backgroundImageMobilePreview}
          aspectRatio={SLIDER_MOBILE_RATIO}
        />
      </Col>
    </Row>
  );
}

const HomeSliderForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingKey, setUploadingKey] = useState('');
  const [slides, setSlides] = useState([]);

  const loadSlider = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/home/slider');
      setSlides(mapSlidesFromApi(res.data.content?.slides || []));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load slider content',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadSlider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSlide = (index, field, value) => {
    setSlides((prev) => prev.map((slide, i) => (i === index ? { ...slide, [field]: value } : slide)));
  };

  const handleImageSelect = (index, type, file) => {
    if (!file) return;
    if (file.size > MAX_CMS_IMAGE_BYTES) {
      showNotification({ message: 'Image must be 5MB or smaller', variant: 'danger' });
      return;
    }

    const previewField = type === 'mobile' ? 'backgroundImageMobilePreview' : 'backgroundImagePreview';
    const dataField = type === 'mobile' ? 'backgroundImageMobileData' : 'backgroundImageData';

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setSlides((prev) => prev.map((slide, i) => (
        i === index
          ? { ...slide, [previewField]: dataUrl, [dataField]: dataUrl }
          : slide
      )));
    };
    reader.onerror = () => {
      showNotification({ message: 'Failed to read image file', variant: 'danger' });
    };
    reader.readAsDataURL(file);
  };

  const addSlide = () => {
    setSlides((prev) => [
      ...prev,
      {
        subTitle: 'Service Company',
        titleLine1: 'Bright Solutions',
        titleLine2: 'for Dark Problems',
        text: '',
        buttonText: 'Learn More',
        buttonLink: '/about',
        backgroundImage: '',
        backgroundImageMobile: '',
        backgroundImagePreview: '',
        backgroundImageMobilePreview: '',
        backgroundImageData: null,
        backgroundImageMobileData: null,
      },
    ]);
  };

  const removeSlide = (index) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slides.length) {
      showNotification({ message: 'Add at least one slide', variant: 'danger' });
      return;
    }

    setSubmitting(true);
    try {
      const preparedSlides = [];

      for (let index = 0; index < slides.length; index += 1) {
        const slide = slides[index];
        let backgroundImage = slide.backgroundImage;
        let backgroundImageMobile = slide.backgroundImageMobile || slide.backgroundImage;

        if (slide.backgroundImageData) {
          backgroundImage = await uploadSlideImage(
            slide.backgroundImageData,
            `home-slider-${index}-background`
          );
        }
        if (slide.backgroundImageMobileData) {
          backgroundImageMobile = await uploadSlideImage(
            slide.backgroundImageMobileData,
            `home-slider-${index}-background-mobile`
          );
        }

        preparedSlides.push({
          subTitle: slide.subTitle,
          titleLine1: slide.titleLine1,
          titleLine2: slide.titleLine2,
          text: slide.text,
          buttonText: slide.buttonText,
          buttonLink: slide.buttonLink,
          backgroundImage,
          backgroundImageMobile,
        });
      }

      const res = await httpClient.put('/api/admin/web-content/home/slider', {
        content: { slides: mapSlidesForSave(preparedSlides) },
      });
      setSlides(mapSlidesFromApi(res.data.content?.slides || []));
      showNotification({ message: 'Homepage slider saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save slider content',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Homepage — Hero Slider"
      description="Each slide uses a full background image. Upload a landscape image for desktop and a portrait image for mobile, then click Save Slider."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Accordion defaultActiveKey="0" className="mb-4">
            {slides.map((slide, index) => (
              <Accordion.Item eventKey={String(index)} key={`slide-${index}`}>
                <Accordion.Header>Slide {index + 1}: {slide.titleLine1 || 'Untitled'}</Accordion.Header>
                <Accordion.Body>
                  <Row className="g-4">
                    <Col xs={12}>
                      <h6 className="mb-2">Slide Preview</h6>
                      <SlidePreview slide={slide} />
                    </Col>

                    <Col xs={12}>
                      <h6 className="mb-0">Sub Title</h6>
                      <Form.Control
                        className="mt-2"
                        value={slide.subTitle}
                        onChange={(e) => updateSlide(index, 'subTitle', e.target.value)}
                        placeholder="Service Company"
                      />
                    </Col>

                    <Col md={6}>
                      <h6 className="mb-0">Title — Line 1</h6>
                      <Form.Control
                        className="mt-2"
                        value={slide.titleLine1}
                        onChange={(e) => updateSlide(index, 'titleLine1', e.target.value)}
                        placeholder="Bright Solutions"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <h6 className="mb-0">Title — Line 2</h6>
                      <Form.Control
                        className="mt-2"
                        value={slide.titleLine2}
                        onChange={(e) => updateSlide(index, 'titleLine2', e.target.value)}
                        placeholder="for Dark Problems"
                      />
                    </Col>

                    <Col xs={12}>
                      <h6 className="mb-0">Description</h6>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        className="mt-2"
                        value={slide.text}
                        onChange={(e) => updateSlide(index, 'text', e.target.value)}
                        placeholder="We have been operating for over a decade..."
                      />
                    </Col>

                    <Col md={6}>
                      <h6 className="mb-0">Button Text</h6>
                      <Form.Control
                        className="mt-2"
                        value={slide.buttonText}
                        onChange={(e) => updateSlide(index, 'buttonText', e.target.value)}
                        placeholder="Learn More"
                      />
                    </Col>
                    <Col md={6}>
                      <h6 className="mb-0">Button Link</h6>
                      <Form.Control
                        className="mt-2"
                        value={slide.buttonLink}
                        onChange={(e) => updateSlide(index, 'buttonLink', e.target.value)}
                        placeholder="/about"
                      />
                    </Col>

                    <Col md={6}>
                      <h6 className="mb-2">Desktop Background</h6>
                      <Form.Text className="d-block mb-2 text-muted">
                        Landscape image for screens 992px and wider (recommended 16:9)
                      </Form.Text>
                      <Form.Control
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => {
                          handleImageSelect(index, 'desktop', e.target.files?.[0]);
                          e.target.value = '';
                        }}
                      />
                    </Col>

                    <Col md={6}>
                      <h6 className="mb-2">Mobile Background</h6>
                      <Form.Text className="d-block mb-2 text-muted">
                        Portrait image for screens below 992px (recommended 9:16)
                      </Form.Text>
                      <Form.Control
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => {
                          handleImageSelect(index, 'mobile', e.target.files?.[0]);
                          e.target.value = '';
                        }}
                      />
                    </Col>

                    {slides.length > 1 && (
                      <Col xs={12}>
                        <Button variant="outline-danger" size="sm" type="button" onClick={() => removeSlide(index)}>
                          Remove Slide
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          <div className="d-flex flex-wrap gap-2">
            <Button type="button" variant="outline-secondary" onClick={addSlide}>
              Add Slide
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Slider'}
            </Button>
          </div>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default HomeSliderForm;
