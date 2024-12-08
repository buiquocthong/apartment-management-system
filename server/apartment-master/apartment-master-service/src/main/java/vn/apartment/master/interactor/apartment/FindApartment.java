package vn.apartment.master.interactor.apartment;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.apartment.ApartmentDTO;
import vn.apartment.master.dto.apartment.ApartmentStatus;
import vn.apartment.master.dto.owner.SimpleOwnerDTO;
import vn.apartment.master.dto.resident.ResidentDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.mapper.ApartmentMapper;
import vn.apartment.master.mapper.OwnerMapper;
import vn.apartment.master.mapper.RenterMapper;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.master.service.OwnerService;
import vn.apartment.master.service.RecordService;
import vn.apartment.master.service.RenterService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class FindApartment {
    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private ApartmentMapper apartmentMapper;
    @Autowired
    private OwnerService ownerService;
    @Autowired
    private OwnerMapper ownerMapper;
    @Autowired
    private RenterService renterService;
    @Autowired
    private RenterMapper renterMapper;
    @Autowired
    private RecordService recordService;

    @Transactional(readOnly = true)
    public ApartmentDTO execute(String apartmentId) {

        if (ObjectUtils.isEmpty(apartmentId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }

        Apartment hadApartment = apartmentService.findApartmentById(apartmentId);
        if (hadApartment.getStatus().equals(ApartmentStatus.AVAILABLE)){
            return apartmentMapper.toDTO(apartmentService.findApartmentById(apartmentId));
        }

        Owner hadOwner = ownerService.findOwnerByApartment(apartmentId);
        SimpleOwnerDTO ownerDTO = ownerMapper.toSimpleDTO(hadOwner);

        ApartmentDTO apartmentDTO = apartmentMapper.toDTO(apartmentService.findApartmentById(apartmentId));
        apartmentDTO.setOwner(ownerDTO);

        if (hadOwner.getOccupancy().equals(Boolean.TRUE)){
            List<ResidentDTO> residents = ownerService.getOwnerByHousehold(hadOwner.getHousehold().getHouseholdId())
                    .stream().map(ownerMapper::toResident)
                    .collect(Collectors.toList());
            apartmentDTO.setResident(residents);
        } else {
            Record hadRecord = recordService.findRecordByOwner(hadOwner.getOwnerId());
            List<ResidentDTO> residents = renterService.getRenterByRecord(hadRecord.getRecordId())
                    .stream().map(renterMapper::toResident)
                    .collect(Collectors.toList());
            apartmentDTO.setResident(residents);
        }
        return apartmentDTO;
    }
}
