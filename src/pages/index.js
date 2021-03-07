import React, { useState } from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa"

import { DialogOverlay, DialogContent } from "@reach/dialog"
import "@reach/dialog/styles.css"

import Button from "../components/button"

const Lightbox = ({
  visible,
  setLightbox,
  selectedImage,
  images,
  setImage,
  locale,
}) => {
  const fullImage = getImage(selectedImage?.src)
  if (visible === false) return null
  return (
    <DialogOverlay
      className="z-50"
      onClick={() => setLightbox(!visible)}
      style={{ background: "rgba(0,0,0,0.8)" }}
      onDismiss={() => setLightbox(false)}
    >
      <DialogContent
        aria-label="lightbox content"
        className="flex w-4/5 bg-transparent text-black"
      >
        <button
          className="absolute top-0 right-0 m-4 text-gray-600 text-4xl focus:outline-none focus:text-black hover:text-black"
          type="button"
          onClick={() => setLightbox(!visible)}
        >
          <FaTimes />
        </button>
        {images.findIndex(({ node }) => node.id === selectedImage.id) > 0 ? (
          <button
            className="absolute top-0 left-auto m-4 md:relative md:m-0 mr-2 text-4xl focus:outline-none focus:text-black hover:text-black"
            type="button"
            onClick={() =>
              setImage(
                images[
                  images.findIndex(({ node }) => node.id === selectedImage.id) -
                    1
                ].node
              )
            }
          >
            <FaChevronLeft />
          </button>
        ) : (
          <button
            className="absolute top-0 left-auto m-4 md:relative md:m-0 mr-2 text-4xl text-gray-700"
            type="button"
            disabled
          >
            <FaChevronLeft />
          </button>
        )}
        <div className="flex-grow-0 md:flex-grow custom__gallery">
          {selectedImage.src ? (
            <GatsbyImage
              image={fullImage}
              className="h-full flex-shrink-0"
              loading="eager"
              style={{ objectFit: "contain" }}
              objectFit="contain"
              objectPosition="50% 50%"
              imgStyle={{ objectFit: "contain" }}
              alt={
                locale === "en"
                  ? selectedImage.description
                  : selectedImage.deDescription
              }
            />
          ) : (
            "no Image"
          )}
          <p
            className="text-center"
            dangerouslySetInnerHTML={{
              __html:
                locale === "en"
                  ? selectedImage.description
                  : selectedImage.deDescription,
            }}
          />
        </div>
        {images.findIndex(({ node }) => node.id === selectedImage.id) <
        images.length - 1 ? (
          <button
            className="absolute top-0 m-4 right-1/2 md:right-0 md:relative md:m-0 mr-2 text-4xl focus:outline-none focus:text-brand-red hover:text-brand-red"
            type="button"
            onClick={() =>
              setImage(
                images[
                  images.findIndex(({ node }) => node.id === selectedImage.id) +
                    1
                ].node
              )
            }
          >
            <FaChevronRight />
          </button>
        ) : (
          <button
            className="absolute top-0 m-4 right-1/2 md:right-0 md:relative md:m-0 mr-2 text-4xl text-gray-700"
            type="button"
            disabled
          >
            <FaChevronRight />
          </button>
        )}
      </DialogContent>
    </DialogOverlay>
  )
}

const GalleryPage = ({ data }) => {
  const { gallery } = data
  const [showLightbox, setLightbox] = useState(false)
  const [selectedImage, setImage] = useState(null)
  const defaultFilter = "40 - group 1"
  const [filter, setFilter] = useState(defaultFilter)
  let categories = new Set()
  const images = filter
    ? gallery.edges.filter(({ node }) => node.categories.includes(filter))
    : gallery.edges
  gallery.edges.map(({ node }) =>
    node.categories.map(category => categories.add(category))
  )
  return (
    <div>
      <main className="w-3/4 mx-auto flex-grow">
        <div className="flex flex-wrap">
          <Button
            status={filter === null ? "active" : ""}
            action={() => setFilter(null)}
            name={"All"}
          />
          {Array.from(categories)
            .sort()
            .map((category, i) => (
              <Button
                key={i}
                status={filter === category ? "active" : ""}
                action={() => setFilter(category)}
                name={category.split(" - ")[1]}
              />
            ))}
        </div>
        <div className="flex flex-wrap">
          {images.map(({ node }) => {
            const thumbnail = getImage(node.thumbnail)
            return (
              <button
                key={node.id}
                className="appearance-none w-64 h-48 m-2 focus:outline-none"
                onClick={() => {
                  setLightbox(!showLightbox)
                  setImage(node)
                }}
              >
                {node.src ? (
                  <GatsbyImage
                    image={thumbnail}
                    className="m-2 object-cover"
                    alt={node.description}
                  />
                ) : (
                  node.id + " Not found"
                )}
              </button>
            )
          })}
        </div>
        <Lightbox
          images={images}
          setLightbox={setLightbox}
          visible={showLightbox}
          setImage={setImage}
          selectedImage={selectedImage}
          locale="en"
        />
      </main>
    </div>
  )
}

export default GalleryPage

export const pageQuery = graphql`
  query {
    gallery: allGalleryJson {
      edges {
        node {
          id
          src {
            childImageSharp {
              gatsbyImageData(
                layout: FULL_WIDTH
                placeholder: BLURRED
                formats: [AUTO, WEBP]
              )
            }
          }
          thumbnail: src {
            childImageSharp {
              gatsbyImageData(
                layout: FIXED
                width: 256
                height: 192
                placeholder: BLURRED
                formats: [AUTO, WEBP]
              )
            }
          }
          description
          categories
        }
      }
    }
  }
`
