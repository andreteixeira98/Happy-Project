import React, { useState, FormEvent, ChangeEvent } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';

import {LeafletMouseEvent} from 'leaflet';

import { FiPlus } from "react-icons/fi";



import '../styles/pages/create-orphanage.css';

import mapIcon from '../utils/mapIcon';
import imageDefault from '../utils/images/1.jpg';

import SideBar from "../components/SideBar";
import api from "../services/api";
import { useHistory } from "react-router-dom";



export default function CreateOrphanage() {
  const history= useHistory();
  const [position, setPosition] = useState({latitude: 0, longitude:0});
  const [name, setName] = useState(' ');
  const [about, setAbout] = useState(' ');
  const [instructions, setInstructions] = useState(' ');
  const [opening_hours, setOpeningHours] = useState(' ');
  const [opening_on_weekends,setOpeningOnWeekends] = useState(true);
  const [contact, setContact] = useState(' ');
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  
  function handleMapClick(event:LeafletMouseEvent){
    const {lat, lng} = event.latlng;
    setPosition({
      latitude:lat,
      longitude:lng
    });
  }
  function handleSelectImages(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files){

        return ;
    }
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);

    const selectedImagesPreview = images.map(image =>{
      return URL.createObjectURL(image);
    });
    setPreviewImages(selectedImagesPreview);

  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    const {latitude, longitude}= position;

    const data = new FormData();

    data.append('name',name);
    data.append('about',about);
    data.append('latitude',String(latitude));
    data.append('longitude',String(longitude));
    data.append('instructions',instructions);
    data.append('opening_hours',opening_hours);
    data.append('opening_on_weekends',String(opening_on_weekends));
    data.append('contact',String(contact));

    images.forEach(image =>{
      data.append('images',image);
    });
    console.log({
      position,
      name,
      about,
      instructions,
      opening_hours,
      images

    })

   await api.post('orphanages',data);
   alert('cadastro realizado com sucesso');
   history.push('/app');
  }
  return (
    <div id="page-create-orphanage">
      <SideBar/>
      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-4.9715909,-39.0248505]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick }
            >
              <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {position.latitude != 0 && (
                 <Marker 
                    interactive ={false} 
                    icon={mapIcon} 
                    position={[
                      position.latitude,
                      position.longitude
                  ]} 
               />
              )} 
             
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome do Orfanato</label>
              <input 
                  id="name" 
                  value={name} 
                  onChange={event => setName(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                  id="name" 
                  maxLength={300} 
                  value={about} 
                  onChange={event => setAbout(event.target.value)}
                  />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image =>{
                    return(
                      <img key={image} src={image} alt={name}/>
                    );
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
               
              </div>

              <input multiple onChange={handleSelectImages} type="file" id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions" 
                value={instructions} 
                  onChange={event => setInstructions(event.target.value)}
                />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horario de Funcionamento</label>
              <input 
                id="opening_hours"
                value={opening_hours} 
                  onChange={event => setOpeningHours(event.target.value)}
                />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                      type="button" 
                      className={opening_on_weekends ? 'active' : ' '}
                      onClick={() => setOpeningOnWeekends(true)}
                    >
                      Sim
                </button>

                <button 
                      type="button"
                      className={!opening_on_weekends ? 'active' : ' '}
                      onClick={() => setOpeningOnWeekends(false)}
                    >
                      Não
                </button>
              </div>

              <div className="input-block">
              <label htmlFor="contact">Telefone de Contato</label>
              <input 
                  type="number"
                id="contact"
                value={contact} 
                  onChange={event => setContact(event.target.value)}
                />
            </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
