package vn.apartment.master.interactor.owner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.owner.UpdateOwnerDTO;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.mapper.OwnerMapper;
import vn.apartment.master.service.OwnerService;

@Interactor
public class UpdateOwner {

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private OwnerMapper ownerMapper;

    @Transactional
    public void execute(UpdateOwnerDTO residentDTO) {
        Owner hadOwner = ownerService.findOwnerById(residentDTO.getOwnerId());
        ownerMapper.updateEntity(residentDTO, hadOwner);
        ownerService.saveOrUpdate(hadOwner);
    }
}
