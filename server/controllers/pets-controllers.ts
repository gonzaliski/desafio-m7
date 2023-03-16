import { cloudinary } from "../lib/cloudinary";
import { Report, Pet, User } from "../db/models";
import { index } from "../lib/algolia";

async function saveLocationOnAlgolia(data) {
  try {
    const algoliaRes = await index
      .saveObject({
        objectID: data.petId,
        _geoloc: {
          lat: data.lat,
          lng: data.lng,
        },
      })
      .then(() => {});
  } catch (e) {
    throw e;
  }
}

async function deletePetOnAlgolia(petId) {
  try {
    index.deleteObject(petId).then(() => {
      console.log("deleted on algolia");
    });
  } catch (e) {
    throw e;
  }
}

function dataToIndex(data, id?) {
  const res: any = {};
  if (data.lat && data.lng) {
    res._geoloc = { lat: data.lat, lng: data.lng };
  }
  if (id) {
    res.objectID = id;
  }
  return res;
}

export async function updateLocationOnAlgolia(data, petId) {
  const indexItem = dataToIndex(data, petId);
  try {
    const algoliaRes = await index.partialUpdateObject(indexItem);
  } catch (e) {
    console.log(e);
  }
}

async function cloudinaryProcess(image) {
  try {
    const cloudinaryRes = await cloudinary.uploader.upload(image, {
      resource_type: "image",
      discard_original_filename: true,
      witdh: 1000,
    });
    return cloudinaryRes;
  } catch (e) {
    throw e;
  }
}

export async function createPet(data, userId) {
  var petImageURL;

  if (data.imageURL) {
    try {
      const imageRes = await cloudinaryProcess(data.imageURL);

      petImageURL = imageRes.secure_url;
    } catch (e) {
      throw e;
    }
  }
  const petData = {
    name: data.petName,
    lat: data.lat,
    lng: data.lng,
    found: false,
    image_URL: petImageURL,
    zone: data.locationName,
    userId,
  };
  try {
    const createdPet = await Pet.create({
      ...petData,
    });
    let algoliaRes = await saveLocationOnAlgolia({
      lat: petData.lat,
      lng: petData.lng,
      petId: createdPet.get("id"),
    });
    return createdPet;
  } catch (error) {
    throw error;
  }
}
function procesData(data) {
  const res: any = {};
  if (data.petName) {
    res.name = data.petName;
  }

  if (data.lat && data.lng) {
    res.lat = data.lat;
    res.lng = data.lng;
  }
  if (data.imageURL) {
    res.image_URL = data.imageURL;
  }
  if (data.locationName) {
    res.zone = data.locationName;
  }

  return res;
}

export async function updatePet(data, id) {
  if (data.imageURL) {
    const imageRes = await cloudinaryProcess(data.imageURL);
    data.imageURL = imageRes.secure_url;
  }
  if (data.lat && data.lng && data.locationName) {
    await updateLocationOnAlgolia(data, id);
  }
  const dataToUpdate = procesData(data);
  console.log(dataToUpdate);

  const updatePet = await Pet.update(dataToUpdate, {
    where: {
      id,
    },
  });
  return updatePet;
}

export async function getAllPets() {
  try {
    return await Pet.findAll({});
  } catch (e) {
    throw e;
  }
}

export async function getAllPetsWithIds(ids: Array<Number | String>) {
  try {
    return await Pet.findAll({
      where: { id: ids },
    });
  } catch (e) {
    throw e;
  }
}

export async function lostPetsNear(lat, lng) {
  try {
    const { hits } = await index.search("", {
      aroundLatLng: `${lat}, ${lng}`,
      aroundRadius: 100000,
    });
    console.log(hits);

    const processedHits = processHits(hits);

    const nearPetsRes = await getAllPetsWithIds(processedHits);
    return nearPetsRes;
  } catch (e) {
    throw e;
  }
}
function processHits(hits) {
  const res = hits.map((h) => {
    return h.objectID;
  });

  return res;
}
export async function reportFound(id) {
  try {
    const petWasFound = await Pet.update(
      { found: true },
      {
        where: {
          id,
        },
      }
    );
    return petWasFound;
  } catch (e) {
    throw e;
  }
}
export async function deletePet(id) {
  try {
    await deletePetOnAlgolia(id);
    return Pet.destroy({
      where: {
        id,
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function userPets(req) {
  try {
    return await Pet.findAll({
      where: {
        userId: req,
      },
      include: [User],
    });
  } catch (e) {
    throw e;
  }
}
