package vn.apartment.master.interactor.apartment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dao.ApartmentRepo;
import vn.apartment.master.dto.apartment.AddApartmentDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.apartment.Block;
import vn.apartment.master.entity.apartment.Floor;
import vn.apartment.master.mapper.ApartmentMapper;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.BlockService;
import vn.apartment.master.service.FloorService;

@Interactor
public class AddApartment {

    private static final Logger LOG = LoggerFactory.getLogger(AddApartment.class);

    @Autowired
    private ApartmentService apartmentService;

    @Autowired
    private ApartmentRepo apartmentRepo;

    @Autowired
    private ApartmentMapper apartmentMapper;

    @Autowired
    private FloorService floorService;

    @Autowired
    private BlockService blockService;


    public void execute(AddApartmentDTO apartmentDTO) {

        if (apartmentDTO == null) {
            throw new InvalidParameterException("The request body is missing.");
        }

        apartmentService.checkExistApartmentByName(apartmentDTO.getName());

        Apartment newApartment = saveNewApartment(apartmentDTO);

    }

    @Transactional
    public Apartment saveNewApartment(AddApartmentDTO apartmentDTO) {
        Apartment newApartment = apartmentMapper.toEntity(apartmentDTO);
        newApartment.setApartmentId(Generators.uuid());

        Floor hadFloor = floorService.findFloorById(apartmentDTO.getFloorId());
        newApartment.setFloor(hadFloor);

        Block hadBlock = blockService.findBlockByFloor(apartmentDTO.getFloorId());
        hadBlock.setTotalApartment(hadBlock.getTotalApartment() + 1);
        blockService.saveOrUpdate(hadBlock);

        return apartmentService.saveOrUpdate(newApartment);
    }

}
