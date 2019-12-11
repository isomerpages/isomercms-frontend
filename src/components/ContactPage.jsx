import React from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

/* eslint
  react/no-array-index-key: 0
 */

const Address = ({
  address,
  locationIndex,
  onFieldChange
}) => (
  <>
    { address &&
      address.length > 0 &&
      address.map((addressLine, addressIndex) => (
        <FormField
          title={`Address line: ${addressIndex + 1}`}
          id={`location-${locationIndex}-address-${addressIndex}`}
          value={addressLine}
          errorMessage=''
          isRequired={addressIndex === 0}
          onFieldChange={onFieldChange}
        />
      ))}
  </>
)

// const OperatingHours = ({
//   operatingHours,
//   locationIndex,
//   onFieldChange
// }) => (
//   <>
//     { operatingHours &&
//       operatingHours.length > 0 &&
//       operatingHours.map((operation, operationIndex) => (
//         <>
//           <FormField
//             title={`Operating hours: ${operationIndex + 1} - days`}
//             id={`location-${locationIndex}-operation-${operationIndex}-days`}
//             value={operation.days}
//             errorMessage=''
//             isRequired={false}
//             onFieldChange={onFieldChange}
//           />
//           <FormField
//             title={`Operating hours: ${operationIndex + 1} - time`}
//             id={`location-${locationIndex}-operation-${operationIndex}-time`}
//             value={operation.time}
//             errorMessage=''
//             isRequired={false}
//             onFieldChange={onFieldChange}
//           />
//           <FormField
//             title={`Operating hours: ${operationIndex + 1} - description`}
//             id={`location-${locationIndex}-operation-${operationIndex}-tidescriptionme`}
//             value={operation.description}
//             errorMessage=''
//             isRequired={false}
//             onFieldChange={onFieldChange}
//           />
//         </>
//       ))
//     }
//   </>
// )

const Location = ({
  title,
  address,
  mapsLink,
  operatingHours,
  locationIndex,
  onFieldChange,
  displayHandler,
  shouldDisplay,
  errors,
}) => (
  <div className={elementStyles.card}>
    <div className={elementStyles.cardHeader}>
      <h2>Location: {title}</h2>
      <button type="button" id={`location-${locationIndex}`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`location-${locationIndex}-icon`} />
      </button>
    </div>
    <FormField
      title="Title"
      id={`location-${locationIndex}-title`}
      value={title}
      errorMessage=''
      isRequired={false}
      onFieldChange={onFieldChange}
    />
    <Address 
      address={address}
      locationIndex={locationIndex}
      onFieldChange={onFieldChange}
    />
    <FormField
      title="Map link"
      id={`location-${locationIndex}-mapsLink`}
      value={mapsLink}
      errorMessage=''
      isRequired={false}
      onFieldChange={onFieldChange}
    />
    {/* <OperatingHours 
      operatingHours={operatingHours}
      locationIndex={locationIndex}
      onFieldChange={onFieldChange}
    /> */}
  </div>
)

const LocationSection = ({
  locations,
  sectionIndex,
  onFieldChange,
  displayHandler,
  shouldDisplay,
  errors,
}) => (
  <div className={elementStyles.card}>
    <div className={elementStyles.cardHeader}>
      <h2>Location details</h2>
      <button type="button" id={`section-${sectionIndex}`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`section-${sectionIndex}-icon`} />
      </button>
    </div>
    { locations &&
      locations.length > 0 && 
      locations.map((location, locationIndex) => (
        <Location 
          title={location.title}
          address={location.address}
          mapsLink={location.maps_link}
          operatingHours={location.operating_hours}
          locationIndex={locationIndex}
          onFieldChange={onFieldChange}
          displayHandler={displayHandler}
          shouldDisplay={shouldDisplay}
        />
      ))
    }
  </div>
)

const ContactSection = ({}) => (
  <>
  </>
)

const EditorContactPage = ({
  agencyName,
  locations,
  onFieldChange,
  displayHandler,
  shouldDisplay,
  errors,
}) => (
  <>
    <div className={elementStyles.card}>
      <div className={elementStyles.cardHeader}>
        <h2>General</h2>
      </div>
      <FormField
        title="Agency name"
        id={`agencyName`}
        value={agencyName}
        errorMessage=''
        isRequired
        onFieldChange={onFieldChange}
      />
    </div>
    <LocationSection 
      locations={locations}
      sectionIndex="0"
      onFieldChange={onFieldChange}
      displayHandler={displayHandler}
      shouldDisplay={shouldDisplay}
      errors={errors}
    />
    <ContactSection />
  </>
)

export default EditorContactPage;